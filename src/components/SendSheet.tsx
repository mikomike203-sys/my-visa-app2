import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, Send, Search, ArrowUpRight, Check, Scan, ImageIcon } from "lucide-react";
import type { Currency } from "../utils/currency";
import { formatMoney } from "../utils/currency";

const contacts = [
  { id: 1, name: "Alex Kim", initials: "AK", account: "Visa **** 4703" },
  { id: 2, name: "Maria Rodriguez", initials: "MR", account: "Visa **** 8291" },
  { id: 3, name: "James Wilson", initials: "JW", account: "Visa **** 3156" },
  { id: 4, name: "Lily Chen", initials: "LC", account: "Visa **** 6042" },
  { id: 5, name: "David Park", initials: "DP", account: "Visa **** 9918" },
];

const quickAmounts = [10, 25, 50, 100, 250, 500];
const MY_QR_DATA = "visa:pay:0xA4F2cE91-Sarah-Mitchell-VISA-4703";

interface Props {
  open: boolean;
  currency: Currency;
  onClose: () => void;
}

export function SendSheet({ open, currency, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const filteredContacts = contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const selectedContactData = selectedContact !== null ? contacts.find((c) => c.id === selectedContact) : null;
  const canSend = amount !== "" && parseFloat(amount) > 0;

  const handleSelectContact = useCallback((id: number) => setSelectedContact(id), []);
  const handleSetAmount = useCallback((val: string) => setAmount(val), []);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), []);
  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value), []);
  const handleAmountInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value), []);
  const handleContinue = useCallback(() => { if (selectedContact !== null) setStep(1); }, [selectedContact]);
  const handleBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const stopScan = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const handleClose = useCallback(() => {
    stopScan();
    setStep(0); setSelectedContact(null); setAmount(""); setNote(""); setSearch("");
    onClose();
  }, [onClose, stopScan]);

  useEffect(() => () => { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); }, []);

  const handleSend = useCallback(() => {
    if (selectedContact !== null && parseFloat(amount) > 0) {
      setStep(3);
      setTimeout(handleClose, 2200);
    }
  }, [selectedContact, amount, handleClose]);

  const startScan = useCallback(async () => {
    setStep(2);
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); }
      }
    } catch (e) { /* camera denied */ }
    setTimeout(() => { setSelectedContact(2); setStep(1); }, 2200);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-md bg-white rounded-t-3xl max-h-[94vh] overflow-hidden flex flex-col" style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 rounded-full bg-slate-200" /></div>
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-black">
                  {step === 0 && "Send Money"}{step === 1 && "Enter Amount"}{step === 2 && "Scan QR"}{step === 3 && "Sent!"}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {step === 0 && "Pick a contact or scan a QR"}{step === 1 && "Set the amount"}{step === 2 && "Point camera at QR"}{step === 3 && "Complete"}
                </p>
              </div>
              <motion.button whileTap={{ scale: 0.85 }} onClick={handleClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4 text-black" strokeWidth={2.8} />
              </motion.button>
            </div>
            <div className="px-6 mb-4 flex gap-2">
              {[0, 1, 2, 3].map((s) => (
                <div key={s} className={`h-1 rounded-full flex-1 transition-all duration-300 ${step >= s ? "bg-blue-600" : "bg-slate-200"}`} />
              ))}
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-10">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={startScan} className="w-full p-5 rounded-3xl bg-blue-600 text-white flex items-center gap-4 cursor-pointer mb-4 shadow-xl shadow-blue-600/20">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Scan className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-extrabold">Scan QR to Pay</p>
                        <p className="text-[11px] text-white/60 font-medium">Point camera at any Visa QR</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/60" strokeWidth={2.5} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => setStep(2)} className="w-full p-5 rounded-3xl bg-white border border-blue-100 flex items-center gap-4 cursor-pointer mb-6 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
                        <QRCodeSVG value={MY_QR_DATA} size={32} level="M" bgColor="#0a0a0a" fgColor="#ffffff" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-extrabold text-black">My QR Code</p>
                        <p className="text-[11px] text-slate-500 font-medium">Show this to receive money</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                    </motion.button>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
                      <input type="text" placeholder="Search contacts..." value={search} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" />
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mb-3">Recent Contacts</p>
                    <div className="space-y-2">
                      {filteredContacts.map((contact) => (
                        <motion.button key={contact.id} whileTap={{ scale: 0.97 }} onClick={() => handleSelectContact(contact.id)} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${selectedContact === contact.id ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`}>
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-xs font-extrabold shrink-0">{contact.initials}</div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-extrabold text-black">{contact.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{contact.account}</p>
                          </div>
                          {selectedContact === contact.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    <motion.button whileTap={{ scale: 0.97 }} disabled={selectedContact === null} onClick={handleContinue} className={`w-full mt-6 py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 ${selectedContact !== null ? "bg-blue-600 text-white cursor-pointer shadow-lg shadow-blue-600/20" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                      Continue <ArrowUpRight className="w-4 h-4" strokeWidth={2.8} />
                    </motion.button>
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    {selectedContactData && (
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-xs font-extrabold">{selectedContactData.initials}</div>
                        <div>
                          <p className="text-sm font-extrabold text-black">{selectedContactData.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{selectedContactData.account}</p>
                        </div>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <p className="text-xs text-slate-500 font-medium mb-2">Enter amount</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-4xl font-extrabold text-black">$</span>
                        <input type="number" value={amount} onChange={handleAmountInputChange} placeholder="0" className="text-5xl font-extrabold text-black bg-transparent border-none outline-none w-40 text-center placeholder:text-slate-200" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">Available: {formatMoney(43093, currency)}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {quickAmounts.map((qa) => (
                        <motion.button key={qa} whileTap={{ scale: 0.92 }} onClick={() => handleSetAmount(qa.toString())} className={`py-2.5 rounded-xl text-sm font-extrabold border cursor-pointer transition-all ${amount === qa.toString() ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200"}`}>{formatMoney(qa, currency, { minimumFractionDigits: 0 })}</motion.button>
                      ))}
                    </div>
                    <textarea value={note} onChange={handleNoteChange} placeholder="Add a note (optional)" className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-black placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black mb-5" rows={2} />
                    <div className="flex gap-3">
                      <motion.button whileTap={{ scale: 0.97 }} onClick={handleBack} className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-black font-extrabold text-sm cursor-pointer">Back</motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} disabled={!canSend} onClick={handleSend} className={`flex-1 py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 ${canSend ? "bg-blue-600 text-white cursor-pointer shadow-lg shadow-blue-600/20" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                        <Send className="w-4 h-4" strokeWidth={2.8} /> Send
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                    <div className="relative w-full max-w-[300px] aspect-square rounded-3xl bg-black overflow-hidden mb-6" style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
                      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-44 h-44 border-2 border-white rounded-2xl relative">
                          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl" />
                          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl" />
                          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl" />
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl" />
                          <motion.div animate={{ y: [0, 170, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="absolute left-2 right-2 top-2 h-0.5 bg-white" style={{ boxShadow: "0 0 10px rgba(255,255,255,0.7)" }} />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 p-2 rounded-lg bg-black/70 backdrop-blur-sm">
                        <p className="text-[10px] text-white/80 text-center font-bold">Scanning for QR code...</p>
                      </div>
                    </div>
                    <p className="text-xs font-extrabold text-black mb-1">Align QR within the frame</p>
                    <p className="text-[11px] text-slate-500 text-center mb-5 max-w-xs">The scan happens automatically. Hold steady for best results.</p>
                    <div className="flex gap-2 w-full">
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => { stopScan(); setStep(0); }} className="flex-1 py-3 rounded-2xl bg-slate-100 text-black font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer">
                        <X className="w-4 h-4" strokeWidth={2.8} /> Cancel
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer">
                        <ImageIcon className="w-4 h-4" strokeWidth={2.8} /> Gallery
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }} className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center mb-5">
                      <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </motion.div>
                    <h3 className="text-xl font-extrabold text-black mb-1">Sent Successfully!</h3>
                    <p className="text-sm text-slate-500 mb-2">{formatMoney(Number(amount || 0), currency)} sent to {selectedContactData?.name}</p>
                    {note && <p className="text-xs text-slate-500 italic">"{note}"</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

