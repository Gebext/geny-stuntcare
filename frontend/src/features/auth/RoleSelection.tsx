import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Baby, Users, Stethoscope, ArrowLeft } from "lucide-react";

const roles = [
  {
    id: "mother",
    icon: Baby,
    title: "Ibu / Orang Tua",
    description: "Input data anak, lihat hasil AI, dan dapatkan panduan harian personal.",
    color: "bg-accent/10 border-accent/30 hover:border-accent",
    iconColor: "text-accent",
  },
  {
    id: "kader",
    icon: Users,
    title: "Kader Posyandu",
    description: "Verifikasi data antropometri dan monitoring anak di wilayah binaan.",
    color: "bg-primary/10 border-primary/30 hover:border-primary",
    iconColor: "text-primary",
  },
  {
    id: "admin",
    icon: Stethoscope,
    title: "Tenaga Kesehatan",
    description: "Analisis agregat, early warning, dan supervisi data kader.",
    color: "bg-info/10 border-info/30 hover:border-info",
    iconColor: "text-info",
  },
];

interface RoleSelectionProps {
  onSelectRole: (role: string) => void;
  onBack: () => void;
}

export const RoleSelection = ({ onSelectRole, onBack }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl relative z-10"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pilih <span className="text-gradient">Peran Anda</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Akses fitur yang sesuai dengan peran Anda dalam sistem kesehatan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => onSelectRole(role.id)}
                className={`w-full h-full bg-card rounded-2xl p-6 border-2 ${role.color} shadow-card hover:shadow-glow transition-all duration-300 text-left group`}
              >
                <div className={`w-16 h-16 rounded-xl ${role.color.split(" ")[0]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className={`w-8 h-8 ${role.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {role.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
