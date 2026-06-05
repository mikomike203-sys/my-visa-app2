import { useAuth } from "../lib/AuthContext";
import { Copy, Share2, Check, ArrowLeft, Gift, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

interface Props {
  onBack: () => void;
}

export function SharePage({ onBack }: Props) {
  const { profile, user } = useAuth();
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}?ref=${encodeURIComponent(user?.email || "")}`;
  const shareText = `Join me on Visa Kenya. Create your wallet, verify KYC, and send money here: ${shareLink}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Visa Kenya", text: shareText, url: shareLink });
    } else {
      await handleCopy();
    }
  };

  return (
    <div className="min-h-dvh bg-[#f7f7f4] p-4 text-black">
      <div className="mx-auto w-full max-w-md py-5">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 rounded-2xl border border-black bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#000]">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="rounded-[30px] border border-black bg-white p-6 shadow-[8px_8px_0_#000]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black bg-[#d7ff5f]">
              <Gift className="h-7 w-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Share & Earn</h1>
              <p className="text-xs font-bold text-zinc-500">Invite friends to Visa Kenya</p>
            </div>
          </div>

          <div className="mb-5 rounded-3xl border border-black bg-[#f7f7f4] p-5 text-center">
            <div className="mb-4 inline-flex rounded-2xl border border-black bg-white p-3">
              <QRCodeSVG value={shareLink} size={170} level="M" />
            </div>
            <p className="text-sm font-black text-black">{profile?.full_name || "Visa Kenya user"}</p>
            <p className="text-xs font-bold text-zinc-500">Visa profile</p>
          </div>

          <div className="mb-4 rounded-2xl border border-black bg-white p-3">
            <p className="mb-1 text-[10px] font-black uppercase text-zinc-500">Referral link</p>
            <code className="block truncate rounded-xl bg-zinc-100 px-3 py-2 text-xs font-bold text-black">{shareLink}</code>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleCopy} className="rounded-2xl border border-black bg-[#d7ff5f] py-3 text-sm font-black text-black shadow-[3px_3px_0_#000]">
              {copied ? <Check className="mr-1 inline h-4 w-4" /> : <Copy className="mr-1 inline h-4 w-4" />}
              Copy
            </button>
            <button onClick={handleShare} className="rounded-2xl border border-black bg-black py-3 text-sm font-black text-white">
              <Share2 className="mr-1 inline h-4 w-4" /> Share
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-black bg-white p-4 text-center shadow-[4px_4px_0_#000]">
            <p className="text-2xl font-black">0</p>
            <p className="text-xs font-bold text-zinc-500">Invites</p>
          </div>
          <div className="rounded-2xl border border-black bg-[#d7ff5f] p-4 text-center shadow-[4px_4px_0_#000]">
            <QrCode className="mx-auto mb-1 h-5 w-5" />
            <p className="text-xs font-black">QR ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
