
'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { User, Car, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";



const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const slideIn = (direction = 'left') => ({
  hidden: { opacity: 0, x: direction === 'left' ? -30 : 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 min-h-screen flex flex-col justify-center">
          {/* Hero Section */}
          <motion.div variants={fadeDown} initial="hidden" animate="show" className={`text-center mb-20 ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Free & Open Source Transportation Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Welcome to <span className="text-blue-500">RideApp</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              100% free and open-source. No hidden fees, no subscriptions. Choose your role to get started.
            </p>
          </motion.div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto w-full mb-16">
            {/* User Card */}
            <motion.div variants={slideIn('left')} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className={`card-hover bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 ${mounted ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="icon-wrapper flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">For Users</h2>
                  <p className="text-slate-400 text-sm">Book rides - completely free</p>
                </div>
              </div>

              <p className="text-slate-300 mb-8 leading-relaxed">
                Access our free platform to book rides instantly, track your driver in real-time, and enjoy a seamless travel experience. No charges, ever.
              </p>

              <div className="space-y-3 mb-8">
                <Link
                  href="/User/Login"
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-3.5 font-semibold text-white"
                >
                  <span>Login as User</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/User/Verification"
                  className="btn-secondary w-full inline-flex items-center justify-center rounded-lg border border-slate-600 px-6 py-3.5 font-medium text-slate-200"
                >
                  Create Free Account
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-700/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Check className="w-5 h-5" />
                    <span>Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Check className="w-5 h-5" />
                    <span>Live Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Check className="w-5 h-5" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Check className="w-5 h-5" />
                    <span>Open Source</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Driver Card */}
            <motion.div variants={slideIn('right')} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className={`card-hover bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 ${mounted ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="icon-wrapper flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white shadow-lg">
                  <Car className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">For Drivers</h2>
                  <p className="text-slate-400 text-sm">Earn with zero platform fees</p>
                </div>
              </div>

              <p className="text-slate-300 mb-8 leading-relaxed">
                Join our free driver network. Keep 100% of your earnings with zero commission fees. Flexible hours and full support.
              </p>

              <div className="space-y-3 mb-8">
                <Link
                  href="/Rider/Login"
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 px-6 py-3.5 font-semibold text-white"
                >
                  <span>Login as Driver</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/Rider/Verification"
                  className="btn-secondary w-full inline-flex items-center justify-center rounded-lg border border-slate-600 px-6 py-3.5 font-medium text-slate-200"
                >
                  Become a Driver
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-700/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Check className="w-5 h-5" />
                    <span>Zero Commission</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Check className="w-5 h-5" />
                    <span>100% Earnings</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Check className="w-5 h-5" />
                    <span>Driver Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Check className="w-5 h-5" />
                    <span>Easy Onboarding</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className={`text-center ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <p className="text-slate-400 mb-3">Need help deciding?</p>
            <Link
              href="/select"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
            >
              <span>Explore Role Selector</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  );
}
