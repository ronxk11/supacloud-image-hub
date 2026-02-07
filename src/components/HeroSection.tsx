import { motion } from "framer-motion";
import { Database, Cloud, Shield, Zap } from "lucide-react";
import supabaseLogo from "@/assets/supabase-logo.png";

const features = [
  { icon: Database, label: "S3-Compatible", desc: "Store any file type" },
  { icon: Shield, label: "RLS Policies", desc: "Row-level security" },
  { icon: Cloud, label: "CDN Backed", desc: "Global distribution" },
  { icon: Zap, label: "Instant APIs", desc: "Auto-generated endpoints" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-8"
        >
          {/* Logo */}
          <motion.div
            className="animate-float"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
              <img
                src={supabaseLogo}
                alt="Supabase Logo"
                className="w-16 h-16 drop-shadow-md"
              />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass px-4 py-1.5 rounded-full flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono text-muted-foreground">
              Powered by Supabase Storage
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl"
          >
            Image Storage
            <br />
            <span className="text-gradient-primary">Made Simple</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Upload, manage, and serve images at scale with Supabase Storage.
            Like Amazon S3, but with a better developer experience.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-4"
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="glass px-4 py-2.5 rounded-lg flex items-center gap-3 hover:border-glow transition-all duration-300 group cursor-default"
              >
                <feat.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{feat.label}</p>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
