import { Logo } from "@/components/shared/Logo"
import { Heart } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Logo size="large" />
            <p className="mt-4 text-muted-foreground max-w-md">
              GENY–StuntCare adalah sistem digital berbasis AI untuk deteksi dini, pencegahan, dan penanganan risiko
              stunting di Indonesia.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Produk</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Fitur
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Harga
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kontak
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 GENY–StuntCare. All rights reserved.</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Dibuat dengan <Heart className="w-4 h-4 text-accent fill-accent" /> untuk Indonesia
          </p>
        </div>
      </div>
    </footer>
  )
}
