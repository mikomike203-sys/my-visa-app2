import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Copy, Check, ArrowDownLeft, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Currency, formatMoney } from "../utils/currency";

interface Props {
  open: boolean;
  currency: Currency;
  email: string;
  fullName: string;
  walletAddress: string;
  onSendToMe: (target: string) => void;
  onClose: () => void;
}

export function ReceiveSheet({ open, email, fullName, walletAddress, onSendToMe, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const walletLink = `${window.location.origin}/?send=${walletAddress}`;
  const qrValue = JSON.stringify({ email, fullName, walletAddress, walletLink });

  const copyAddress = async () => {
    await navigator.clipboard.writeText(walletLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const openSendWindow = () => {
    const url = `${window.location.origin}/?send=${encodeURIComponent(walletAddress)}${requestAmount ? `&amount=${encodeURIComponent(requestAmount)}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareRequest = async () => {
    const url = `${window.location.origin}/?send=${encodeURIComponent(walletAddress)}${requestAmount ? `&amount=${encodeURIComponent(requestAmount)}` : ""}`;
    if (navigator.share) {
      await navigator.share({ title: "Visa Kenya payment request", text: `${fullName} requested money`, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-black">Receive Money</h3>
                  <p className="text-xs text-slate-500">Share your details</p>
                </div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 mb-4 shadow-sm">
                <QRCodeSVG value={qrValue} size={180} level="M" />
              </div>
              <p className="text-sm font-bold text-black mb-1">{fullName}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs text-slate-500">Visa profile</span>
              </div>
              <div className="rounded-2xl border border-black bg-[#f7f7f4] p-3 text-left">
                <p className="text-[10px] font-black uppercase text-slate-500">Payment request link</p>
                <p className="truncate font-mono text-xs font-bold text-black">{walletAddress}</p>
              </div>
              <input
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="Optional request amount"
                className="mt-3 w-full rounded-xl border border-black bg-white px-3 py-3 text-sm font-bold text-black outline-none"
              />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={copyAddress} className="rounded-xl border border-black bg-[#d7ff5f] px-3 py-3 text-xs font-black text-black shadow-[2px_2px_0_#000]">
                  {copied ? <Check className="mr-1 inline h-4 w-4" /> : <Copy className="mr-1 inline h-4 w-4" />}
                  Copy link
                </button>
                <button onClick={shareRequest} className="rounded-xl border border-black bg-black px-3 py-3 text-xs font-black text-white">
                  <ExternalLink className="mr-1 inline h-4 w-4" />
                  Share link
                </button>
              </div>
              <button onClick={() => onSendToMe(walletAddress)} className="mt-2 w-full rounded-xl border border-black bg-white px-3 py-3 text-xs font-black text-black">
                Send to this wallet
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
