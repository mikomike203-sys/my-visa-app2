import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, ScanLine, Keyboard, Upload, Camera, ShieldCheck, UserRound, ChevronRight } from "lucide-react";
import jsQR from "jsqr";
import { Currency, formatMoney, toBaseCurrency } from "../utils/currency";
import type { Card, PublicPerson } from "../types/database";

interface Props {
  open: boolean;
  currency: Currency;
  balance: number;
  userCards: Card[];
  people: PublicPerson[];
  kycStatus: "pending" | "verified" | "rejected" | "not_submitted";
  initialRecipient?: string;
  initialAmount?: string;
  onSend: (toEmail: string, amount: number, description?: string, cardId?: string) => Promise<void>;
  onClose: () => void;
}

export function SendSheet({ open, currency, balance, userCards, people, kycStatus, initialRecipient = "", initialAmount = "", onSend, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(userCards[0]?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [mode, setMode] = useState<"type" | "upload" | "camera">("type");
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanActiveRef = useRef(false);

  useEffect(() => {
    if (open && initialRecipient) setEmail(initialRecipient);
    if (open && initialAmount) setAmount(initialAmount);
  }, [initialAmount, initialRecipient, open]);

  useEffect(() => {
    if (!selectedCardId && userCards[0]?.id) setSelectedCardId(userCards[0].id);
  }, [selectedCardId, userCards]);

  const parseQrRecipient = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      return parsed.email || parsed.walletAddress || parsed.recipient || parsed.id || raw;
    } catch {
      try {
        const url = new URL(raw);
        return url.searchParams.get("send") || raw;
      } catch {
        return raw;
      }
    }
  };

  const handleQrUpload = async (file?: File) => {
    setScanMessage("");
    setError("");
    if (!file) return;
    try {
      const bitmap = await createImageBitmap(file);
      let raw = "";
      const Detector = (window as any).BarcodeDetector;
      if (Detector) {
        const detector = new Detector({ formats: ["qr_code"] });
        const codes = await detector.detect(bitmap);
        raw = codes?.[0]?.rawValue || "";
      }
      if (!raw) {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(bitmap, 0, 0);
        const image = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = image ? jsQR(image.data, image.width, image.height) : null;
        raw = decoded?.data || "";
      }
      if (!raw) {
        setScanMessage("No QR code found in that image.");
        return;
      }
      const recipient = parseQrRecipient(raw);
      if (recipient) {
        setEmail(recipient);
        setDescription((prev) => prev || `Payment to ${recipient}`);
        setScanMessage("Recipient loaded from QR.");
      } else {
        setScanMessage("QR found, but it did not include a recipient email.");
      }
    } catch (err) {
      setScanMessage("Could not read that QR code. Try a clearer image.");
    }
  };

  const stopCamera = () => {
    scanActiveRef.current = false;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };

  const startCameraScan = async () => {
    setScanMessage("");
    setError("");
    const Detector = (window as any).BarcodeDetector;
    if (!navigator.mediaDevices?.getUserMedia) {
      setScanMessage("Camera access is not supported here. Use Upload QR and choose camera/photo.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      scanActiveRef.current = true;
      setTimeout(async () => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const detector = Detector ? new Detector({ formats: ["qr_code"] }) : null;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const scan = async () => {
          if (!scanActiveRef.current || !videoRef.current || !streamRef.current) return;
          try {
            let raw = "";
            if (detector) {
              const codes = await detector.detect(videoRef.current);
              raw = codes?.[0]?.rawValue || "";
            } else if (ctx && videoRef.current.videoWidth && videoRef.current.videoHeight) {
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
              const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
              raw = jsQR(image.data, image.width, image.height)?.data || "";
            }
            if (raw) {
              scanActiveRef.current = false;
              const recipient = parseQrRecipient(raw);
              setEmail(recipient);
              setDescription((prev) => prev || `Payment to ${recipient}`);
              setScanMessage("Recipient loaded from camera.");
              stopCamera();
              return;
            }
          } catch {
            // Keep scanning; single-frame failures are normal.
          }
          requestAnimationFrame(scan);
        };
        scan();
      }, 50);
    } catch {
      setScanMessage("Camera permission was blocked or unavailable.");
    }
  };

  useEffect(() => () => stopCamera(), []);

  const handleSend = async () => {
    setError("");
    if (!email) { setError("Enter recipient email, username, or wallet address"); return; }
    const displayAmount = parseFloat(amount);
    const numAmount = toBaseCurrency(displayAmount, currency);
    if (isNaN(displayAmount) || displayAmount <= 0) { setError("Enter a valid amount"); return; }
    if (numAmount > balance) { setError("Insufficient balance"); return; }
    if (kycStatus !== "verified") { setError("Finish KYC verification before completing a send."); return; }

    setLoading(true);
    try {
      await onSend(email, numAmount, description || undefined, selectedCardId);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEmail("");
        setAmount("");
        setDescription("");
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayAmount = parseFloat(amount || "0");
  const baseAmount = toBaseCurrency(displayAmount, currency);
  const fee = baseAmount * 0.01;
  const canSwipe = Boolean(email) && displayAmount > 0 && baseAmount <= balance && kycStatus === "verified";
  const shownPeople = people.filter((person) => person.email !== email).slice(0, 50);
  const selectedPerson = people.find((person) => person.email === email || person.id === email || person.fullName === email);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/35"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-[430px] max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-white p-4 min-[390px]:p-6 pb-[max(24px,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-black">Send Money</h3>
                <p className="text-xs text-slate-500 mt-0.5">Balance: {formatMoney(balance, currency)}</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-lg font-extrabold text-black">Sent Successfully!</p>
                <p className="text-sm text-slate-500 mt-1">{formatMoney(toBaseCurrency(parseFloat(amount || "0"), currency), currency)} to {email}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm p-3 rounded-xl bg-red-50">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "type", label: "Type", icon: Keyboard },
                    { id: "upload", label: "Upload QR", icon: Upload },
                    { id: "camera", label: "Camera", icon: Camera },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setMode(item.id as typeof mode)}
                        className={`rounded-xl border px-3 py-2 text-xs font-black flex items-center justify-center gap-1 ${mode === item.id ? "border-black bg-[#d7ff5f] text-black shadow-[2px_2px_0_#000]" : "border-slate-200 bg-white text-slate-600"}`}
                      >
                        <Icon className="h-3.5 w-3.5" /> {item.label}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Recipient</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email, username, or wallet address"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {shownPeople.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-black text-slate-600">People</p>
                      <p className="text-[10px] font-bold text-slate-400">Swipe sideways</p>
                    </div>
                    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 scrollbar-hide">
                      {shownPeople.map((person) => (
                        <button
                          key={person.id}
                          onClick={() => {
                            setEmail(person.email);
                            setDescription((prev) => prev || `Payment to ${person.fullName}`);
                          }}
                          className="w-[74px] shrink-0 text-center"
                        >
                          <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-black bg-[#d7ff5f]">
                            {person.avatarUrl ? (
                              <img src={person.avatarUrl} alt={person.fullName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-black text-black">{person.fullName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <p className="truncate text-[10px] font-black text-black">{person.fullName}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {mode === "upload" && (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-black bg-[#d7ff5f] px-4 py-3 text-xs font-black text-black shadow-[3px_3px_0_#000]">
                    <ScanLine className="w-4 h-4" />
                    Upload recipient QR
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleQrUpload(e.target.files?.[0])}
                    />
                  </label>
                )}
                {mode === "camera" && (
                  <div className="rounded-2xl border border-black bg-black p-3">
                    {cameraOpen ? (
                      <>
                        <video ref={videoRef} muted playsInline className="w-full rounded-xl object-cover" style={{ height: "min(73vw, 310px)" }} />
                        <button onClick={stopCamera} className="mt-3 w-full rounded-xl bg-white py-2 text-xs font-black text-black">Stop camera</button>
                      </>
                    ) : (
                      <button onClick={startCameraScan} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d7ff5f] px-4 py-3 text-xs font-black text-black">
                        <Camera className="h-4 w-4" /> Open device camera
                      </button>
                    )}
                  </div>
                )}
                {scanMessage && <p className="text-xs font-bold text-slate-600">{scanMessage}</p>}
                {kycStatus !== "verified" && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-bold text-amber-800">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    You can prepare this transfer, but final sending unlocks after KYC is verified.
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl font-extrabold"
                  />
                </div>

                {email && (
                  <div className="rounded-2xl border border-black bg-[#f7f7f4] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black bg-[#d7ff5f]">
                        {selectedPerson?.avatarUrl ? (
                          <img src={selectedPerson.avatarUrl} alt={selectedPerson.fullName} className="h-full w-full object-cover" />
                        ) : (
                          <UserRound className="h-6 w-6 text-black" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-black">{selectedPerson?.fullName || email}</p>
                        <p className="truncate text-xs font-bold text-zinc-500">{selectedPerson?.email || "Confirm recipient before sending"}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Description (optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this for?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {userCards.length > 0 && (
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">From Card</label>
                    <select
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {userCards.map((c) => (
                        <option key={c.id} value={c.id}>{c.label} - {formatMoney(c.balance, currency)}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Amount</span>
                    <span className="font-bold text-black">{formatMoney(baseAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-slate-600">Fee (1%)</span>
                    <span className="font-bold text-black">{formatMoney(fee, currency)}</span>
                  </div>
                  <div className="border-t border-blue-200 mt-2 pt-2 flex justify-between">
                    <span className="font-bold text-black">Total</span>
                    <span className="font-bold text-black">{formatMoney(baseAmount + fee, currency)}</span>
                  </div>
                </div>

                <div className={`relative h-14 overflow-hidden rounded-2xl border border-black ${canSwipe ? "bg-[#d7ff5f]" : "bg-slate-100"}`}>
                  <p className="absolute inset-0 flex items-center justify-center text-sm font-black text-black">
                    {loading ? "Sending..." : canSwipe ? "Swipe to send" : "Complete recipient, amount, and KYC"}
                  </p>
                  <motion.button
                    type="button"
                    drag={canSwipe && !loading ? "x" : false}
                    dragConstraints={{ left: 0, right: 280 }}
                    dragElastic={0.06}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 170) handleSend();
                    }}
                    onClick={() => {
                      if (!canSwipe) handleSend();
                    }}
                    className="absolute left-1 top-1 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
