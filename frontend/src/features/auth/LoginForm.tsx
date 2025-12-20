"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

interface LoginFormProps {
  role: string;
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: () => void;
  isLoading: boolean;
}

const roleLabels: Record<string, string> = {
  mother: "Ibu / Orang Tua",
  kader: "Kader Posyandu",
  admin: "Tenaga Kesehatan",
};

export const LoginForm = ({
  role,
  onBack,
  onLogin,
  onRegister,
  isLoading,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Ornaments */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Masuk sebagai
            </h1>
            <span className="inline-block px-4 py-1 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">
              {roleLabels[role] || "User"}
            </span>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Lupa password?
              </button>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {role === "mother" && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Belum punya akun?{" "}
                <button
                  onClick={onRegister}
                  className="text-primary font-semibold hover:underline"
                  disabled={isLoading}
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          )}

          {role !== "mother" && (
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground italic">
                Hubungi administrator jika Anda belum memiliki akses akun.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
