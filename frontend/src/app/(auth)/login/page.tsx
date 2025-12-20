"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoleSelection } from "@/features/auth/RoleSelection";
import { LoginForm } from "@/features/auth/LoginForm";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { useLoginMutation } from "@/hooks/auth/useAuthMutation";
import { useRegisterMutation } from "@/hooks/auth/useRegisterMutation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"SELECT_ROLE" | "LOGIN" | "REGISTER">(
    "SELECT_ROLE"
  );
  const [selectedRole, setSelectedRole] = useState<string>("");

  const loginMutation = useLoginMutation();

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setStep("LOGIN");
  };

  const handleLogin = (email: string, password: string) => {
    loginMutation.mutate({
      payload: {
        email,
        password,
        role: selectedRole,
      },
    });
  };

  const registerMutation = useRegisterMutation(() => setStep("LOGIN"));

  const handleRegister = (
    name: string,
    email: string,
    phone: string,
    pass: string
  ) => {
    registerMutation.mutate({
      name,
      email,
      phone,
      password: pass,
    });
  };
  switch (step) {
    case "SELECT_ROLE":
      return (
        <RoleSelection
          onSelectRole={handleSelectRole}
          onBack={() => router.push("/")}
        />
      );

    case "LOGIN":
      return (
        <LoginForm
          role={selectedRole}
          onBack={() => setStep("SELECT_ROLE")}
          onLogin={handleLogin}
          onRegister={() => setStep("REGISTER")}
          // Tambahkan loading state pada button login
          isLoading={loginMutation.isPending}
        />
      );

    case "REGISTER":
      return (
        <RegisterForm
          role={selectedRole}
          onBack={() => setStep("LOGIN")}
          onRegister={handleRegister}
        />
      );
  }
}
