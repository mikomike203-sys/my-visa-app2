import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, Share2, Check, ArrowDownLeft, Download, Scan, Eye, EyeOff } from "lucide-react";
import type { Currency } from "../utils/currency";
import { formatMoney } from "../utils/currency";

interface Props {
  open: boolean;
  currency: Currency;
  onClose: () => void;
}

const MY_QR_DATA = "visa:pay:0xA4F2cE91-Sarah-Mitchell-VISA-4703";

export function ReceiveSheet({ open, currency, onClose }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [hideAmount, setHideAmount] = useState(false);

  const accountDetails = {
    name: "Sarah Mitchell",
    bank: "Visa Limit Bank",
    accountNumber: "8287 4928 4703",
    routingNumber: "021000021",
    swift: "VISAUS33",
    iban: "US12 3456 7890 1234 5678",
  };

  const fields = [
    { key: "name", label: "Account Holder", value: accountDetails.name },
    { key: "bank", label: "Bank", value: accountDetails.bank },
    { key: "accountNumber", label: "Account Number", value: accountDetails.accountNumber },
    { key: "routingNumber", label: "Routing Number", value: accountDetails.routingNumber },
    { key: "swift", label: "SWIFT / BIC", value: accountDetails.swift },
    { key: "iban", label: "IBAN", value: accountDetails.iban },
  ];

  const qrData = amount ? `${MY_QR_DATA}?amount=${amount}` : MY_QR_DATA;

  const handleCopy = useCallback((key: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const handleCopyAll = useCallback(() => {
    const text = fields.map((f) => `${f.label}: ${f.value}`).join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 2000);
  }, [fields]);

  const handleShare = useCallback(() => {
    const details = `Pay me via Visa Limit\nName: ${accountDetails.name}\nBank: ${accountDetails.bank}\nAccount: ${accountDetails.accountNumber}\nRouting: ${accountDetails.routingNumber}\nSWIFT: ${accountDetails.swift}\n\nOr scan my QR: ${qrData}`;
    if (navigator.share) {
      navigator.share({ title: "My Visa Limit QR", text: details }).catch(() => {});
    } else {
      navigator.clipboard.writeText(details).catch(() => {});
      setCopiedField("share");
      setTimeout(() => setCopiedField(null), 2000);
    }
  }, [qrData, accountDetails]);

  const handleDownload = useCallback(() => {
    const svg = document.getElementById("my-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visa-qr-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleClose = useCallback(() => {
    setCopiedField(null);
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-md bg-white rounded-t-3xl max-h-[94vh] overflow-hidden flex flex-col" style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 rounded-full bg-slate-200" /></div>
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-black">Receive Money</h2>
                <p className="text-xs text-slate-500 font-medium">Scan or share your QR</p>
              </div>
              <motion.button whileTap={{ scale: 0.85 }} onClick={handleClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4 text-black" strokeWidth={2.8} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-10">
              {/* Big QR Code Card (B&W) */}
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-black mb-6" style={{ boxShadow: "0 16px 40px rgba(37,99,235,0.24), inset 0 1px 1px rgba(255,255,255,0.1)" }}>
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-white/5 blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)" }}>
                        <Scan className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/50 font-extrabold">My QR</p>
                        <p className="text-xs font-extrabold text-white">{accountDetails.name}</p>
                      </div>
                    </div>
                    {amount && (
                      <div className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                        <p className="text-[10px] text-white/60 font-extrabold">Amount</p>
                        <p className="text-sm font-extrabold text-white">{formatMoney(Number(amount || 0), currency)}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-2xl flex items-center justify-center" style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
                    <QRCodeSVG id="my-qr-code" value={qrData} size={220} level="H" bgColor="#ffffff" fgColor="#0a0a0a" includeMargin={false} />
                  </div>
                  <p className="text-center text-[10px] text-white/40 font-mono mt-3 break-all px-2">
                    {hideAmount ? "************" : qrData}
                  </p>
                </div>
              </motion.div>

              {/* Amount preset */}
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mb-2">Request specific amount (optional)</p>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-extrabold">$</span>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-extrabold text-black placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black" />
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setHideAmount(!hideAmount)} className="w-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center cursor-pointer" title="Toggle amount visibility">
                    {hideAmount ? <EyeOff className="w-4 h-4 text-black" strokeWidth={2.5} /> : <Eye className="w-4 h-4 text-black" strokeWidth={2.5} />}
                  </motion.button>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[10, 25, 50, 100].map((v) => (
                    <motion.button key={v} whileTap={{ scale: 0.95 }} onClick={() => setAmount(v.toString())} className={`flex-1 py-1.5 rounded-lg text-[11px] font-extrabold border cursor-pointer transition-all ${amount === v.toString() ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200"}`}>
                      {formatMoney(v, currency, { minimumFractionDigits: 0 })}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopyAll} className="py-3 rounded-2xl bg-blue-600 text-white font-extrabold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer shadow-lg shadow-blue-600/20">
                  {copiedField === "all" ? <Check className="w-4 h-4" strokeWidth={2.8} /> : <Copy className="w-4 h-4" strokeWidth={2.8} />}
                  <span>Copy</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleShare} className="py-3 rounded-2xl bg-white border border-slate-200 text-black font-extrabold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <Share2 className="w-4 h-4" strokeWidth={2.5} />
                  <span>Share</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleDownload} className="py-3 rounded-2xl bg-white border border-slate-200 text-black font-extrabold text-[11px] flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <Download className="w-4 h-4" strokeWidth={2.5} />
                  <span>Save</span>
                </motion.button>
              </div>

              {/* Account details */}
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mb-3 flex items-center gap-1.5">
                <ArrowDownLeft className="w-3 h-3" strokeWidth={2.8} /> Account Details
              </p>
              <div className="space-y-2.5">
                {fields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold">{field.label}</p>
                      <p className="text-sm font-extrabold text-black font-mono truncate">{field.value}</p>
                    </div>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleCopy(field.key, field.value)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shrink-0">
                      {copiedField === field.key ? <Check className="w-3.5 h-3.5 text-black" strokeWidth={2.8} /> : <Copy className="w-3.5 h-3.5 text-slate-500" strokeWidth={2.5} />}
                    </motion.button>
                  </div>
                ))}
              </div>

              {copiedField && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-2xl bg-blue-600 text-white text-center">
                  <p className="text-xs font-extrabold flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
                    {copiedField === "all" ? "All details" : copiedField === "share" ? "Link" : "Field"} copied to clipboard!
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

