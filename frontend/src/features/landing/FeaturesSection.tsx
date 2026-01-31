"use client"

import { motion } from "framer-motion"
import { Brain, ClipboardCheck, Bell, MessageCircle, BarChart3, Users } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Risk Analysis",
    description:
      "Analisis risiko stunting berbasis AI dengan klasifikasi akurat dan deteksi dini faktor risiko dominan.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ClipboardCheck,
    title: "Dual Input System",
    description: "Sistem input ganda: self-reported dari ibu dan data terverifikasi dari kader posyandu.",
    color: "bg-info/10 text-info",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Pengingat otomatis untuk TTD, jadwal posyandu, dan imunisasi anak tepat waktu.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: MessageCircle,
    title: "GENY AI Chatbot",
    description: "Asisten AI yang menjawab pertanyaan seputar kesehatan anak berdasarkan data pengguna.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: BarChart3,
    title: "Growth Monitoring",
    description: "Pantau pertumbuhan anak dengan grafik WHO dan rekomendasi MPASI lokal sesuai usia.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Akses berbasis peran untuk ibu, kader posyandu, dan tenaga kesehatan puskesmas.",
    color: "bg-secondary text-secondary-foreground",
  },
]

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fitur <span className="text-gradient">Unggulan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            GENY menerjemahkan data kesehatan menjadi aksi nyata untuk mencegah stunting pada anak Anda
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300 border border-border hover:border-primary/30">
                <div
                  className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
