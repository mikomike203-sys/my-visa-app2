import { Shield, Clock, Star, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Advanced Security",
    description: "Real-time fraud monitoring with AI-powered threat detection and instant freeze.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Clock,
    title: "Instant Transfers",
    description: "Send money globally in seconds with zero hidden fees and great exchange rates.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Star,
    title: "Premium Rewards",
    description: "Earn up to 5% cashback on every purchase with exclusive partner offers.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export function Features() {
  return (
    <div className="mt-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Why VisaVault?</h2>
          <p className="text-slate-500 text-sm mt-1">Built for those who demand more.</p>
        </div>
        <button className="hidden sm:flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:gap-2 transition-all">
          Learn more <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <f.icon className={`w-5 h-5 ${f.color}`} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}