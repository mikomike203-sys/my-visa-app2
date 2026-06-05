import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  Landmark,
  PieChart,
  ScanLine,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const features = [
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Monitor your finances live with clear, intuitive dashboards." },
  { icon: PieChart, title: "Smart Budgeting", desc: "Plan and adjust spending with clean controls and instant summaries." },
  { icon: ShieldCheck, title: "Secure Syncing", desc: "Protected wallet access with Supabase auth and encrypted sessions." },
  { icon: WalletCards, title: "Card Controls", desc: "Create cards, freeze cards, and move money from one wallet." },
];

const plans = [
  { name: "Starter", price: "KSh 0", body: "Perfect for a first wallet.", highlight: false },
  { name: "Growth", price: "KSh 3,250", body: "For active teams and card flows.", highlight: true },
  { name: "Scale", price: "KSh 9,750", body: "For larger balances and audits.", highlight: false },
];

export function LandingPage({ onGetStarted, onSignIn }: Props) {
  const startSubscription = (plan: { name: string; price: string }) => {
    if (plan.price === "KSh 0") {
      onGetStarted();
      return;
    }
    const amountKes = Number(plan.price.replace(/[^\d]/g, ""));
    fetch("/api/paystack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "subscriber@visakenya.app",
        amountUsd: amountKes / 129,
        callbackUrl: window.location.origin,
        metadata: { kind: "subscription", plan: plan.name },
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not start transaction");
        window.location.href = data.authorizationUrl;
      })
      .catch(() => onGetStarted());
  };

  return (
    <main className="min-h-dvh bg-[#f7f7f4] text-black">
      <section className="relative overflow-hidden border-b border-black/10 bg-white">
        <div className="mx-auto flex min-h-[92dvh] max-w-7xl flex-col px-5 py-5 sm:px-8">
          <nav className="flex items-center justify-between rounded-[22px] border border-black/10 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black bg-black text-white">
                <Landmark className="h-5 w-5" strokeWidth={2.6} />
              </div>
              <span className="text-sm font-black tracking-tight">Visa Kenya</span>
            </div>
            <button
              onClick={onSignIn}
              className="rounded-2xl border border-black bg-white px-4 py-2 text-xs font-black text-black shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5"
            >
              Open Wallet
            </button>
          </nav>

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-black bg-[#d7ff5f] px-4 py-2 text-xs font-black"
              >
                <ScanLine className="h-4 w-4" /> Smart money platform
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
              >
                Track every shilling, grow every investment.
              </motion.h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-zinc-600 sm:text-lg">
                Smarter tools for Kenyan teams to manage cards, cash flow, wallet transfers, and financial growth with confidence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-black bg-black px-6 py-4 text-sm font-black text-white shadow-[5px_5px_0_#d7ff5f] transition-transform hover:-translate-y-1"
                >
                  Start free <ArrowRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onSignIn}
                  className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-black bg-white px-6 py-4 text-sm font-black text-black shadow-[5px_5px_0_#000] transition-transform hover:-translate-y-1"
                >
                  Sign in with wallet
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, rotate: -1, y: 20 }}
              animate={{ opacity: 1, rotate: 0, y: 0 }}
              transition={{ delay: 0.18 }}
              className="relative mx-auto w-full max-w-[560px]"
            >
              <div className="overflow-hidden rounded-[32px] border border-black bg-white shadow-[10px_10px_0_#000]">
                <img
                  src="/landing-payment.jpg"
                  alt="Tap to pay with card and phone"
                  className="w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase text-zinc-500">Features</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Streamline finances with smart features.</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[24px] border border-black bg-white p-5 shadow-[5px_5px_0_#000] transition-transform hover:-translate-y-1">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-black bg-[#d7ff5f]">
                <feature.icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-black">{feature.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-[28px] border border-black p-6 shadow-[6px_6px_0_#000] ${plan.highlight ? "bg-black text-white" : "bg-white text-black"}`}>
              {plan.highlight && <span className="mb-4 inline-block rounded-full bg-[#d7ff5f] px-3 py-1 text-xs font-black text-black">Best Deal</span>}
              <h3 className="text-xl font-black">{plan.name}</h3>
              <p className="mt-3 text-3xl font-black">{plan.price}</p>
              <p className={`mt-2 text-sm ${plan.highlight ? "text-zinc-300" : "text-zinc-600"}`}>{plan.body}</p>
              <button onClick={() => startSubscription(plan)} className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black ${plan.highlight ? "border-white bg-white text-black" : "border-black bg-[#d7ff5f] text-black"}`}>
                {plan.price === "KSh 0" ? "Get Started" : "Pay with Paystack"} <ArrowRight className="h-4 w-4" />
              </button>
              <div className="mt-5 space-y-3 text-sm font-bold">
                {["Real-time dashboard access", "Wallet transfers", "Card management"].map((item) => (
                  <p key={item} className="flex items-center gap-2"><Check className="h-4 w-4" /> {item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
