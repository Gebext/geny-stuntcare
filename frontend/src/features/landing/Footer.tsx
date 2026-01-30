import { Logo } from "@/components/shared/Logo";
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8 overflow-hidden flex-shrink-0">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Logo size="large" />
          </div>
        </div>

        <div className="pt-2 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            © 2025 GENY–StuntCare. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Dibuat dengan <Heart className="w-4 h-4 text-accent fill-accent" />{" "}
            untuk Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};
