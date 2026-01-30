"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import HeroImage from "../../../public/assets/hero-illustration.png";

export const HeroSection = () => {
  return (
    <section className="relative flex-1 flex items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-soft" />
      <div className="absolute top-10 md:top-20 right-6 md:right-10 w-44 md:w-72 h-44 md:h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 md:bottom-20 left-6 md:left-10 w-56 md:w-96 h-56 md:h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 pt-16 lg:pt-0 py-10 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">
                AI-Powered Child Health Monitoring
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Cegah Stunting,{" "}
              <span className="text-gradient">Wujudkan Generasi Sehat</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Sistem digital berbasis AI untuk deteksi dini, pencegahan, dan
              penanganan risiko stunting dengan rekomendasi personal yang
              kontekstual untuk setiap ibu dan anak.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl">
                Mulai Sekarang
                <ArrowRight className="w-5 h-5" />
              </Button>
              <a
                href="https://docs.genystuntcare.cloud"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="xl">
                  Pelajari Lebih Lanjut
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={HeroImage}
                  alt="Happy mother and child"
                  width={600}
                  height={600}
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-card"
                />
              </motion.div>

              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -left-2 md:-left-4 top-1/4 bg-card p-4 rounded-2xl shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Risiko Rendah
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Status Anak Anda
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -right-2 md:-right-4 bottom-1/4 bg-card p-4 rounded-2xl shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      AI Rekomendasi
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Personal untuk Anda
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
