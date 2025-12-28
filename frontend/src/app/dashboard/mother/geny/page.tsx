"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Send,
  Bot,
  Sparkles,
  User,
  Loader2,
  ChevronLeft,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useChat, useAddChat } from "@/hooks/chats/useChat";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast"; // Pastikan path toast benar

const CHAT_TEMPLATES = [
  {
    label: "Status Gizi",
    message: "Geny, bagaimana status gizi anak saya berdasarkan data terakhir?",
    icon: "📊",
  },
  {
    label: "Saran MPASI",
    message: "Berikan saran menu makanan bergizi untuk anak seusia anak saya.",
    icon: "🥗",
  },
  {
    label: "Jadwal Imunisasi",
    message: "Kapan jadwal imunisasi berikutnya yang harus dilakukan?",
    icon: "💉",
  },
];

export default function GenyChatPage() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Inisialisasi: Ambil session & temp messages dari storage
  useEffect(() => {
    const savedSession = localStorage.getItem("geny_session_id");
    const savedLocalMsgs = sessionStorage.getItem("geny_temp_msgs");

    if (savedSession && savedSession !== "null")
      setActiveSessionId(savedSession);
    if (savedLocalMsgs) setLocalMessages(JSON.parse(savedLocalMsgs));
  }, []);

  // 2. Persistence: Simpan ke session storage setiap ada perubahan localMessages
  useEffect(() => {
    if (localMessages.length > 0) {
      sessionStorage.setItem("geny_temp_msgs", JSON.stringify(localMessages));
    }
  }, [localMessages]);

  const {
    data: historyData,
    isLoading,
    isError,
    refetch,
  } = useChat(activeSessionId);
  const sendMessage = useAddChat();

  // 3. Merging: Gabungkan history server + local RAM dengan deduping
  const allMessages = useMemo(() => {
    const history = Array.isArray(historyData) ? historyData : [];
    const combined = [...history, ...localMessages];

    const uniqueMap = new Map();
    combined.forEach((m) => {
      const key = m.id || `${m.sender}-${m.message.slice(0, 50)}`;
      uniqueMap.set(key, m);
    });

    return Array.from(uniqueMap.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [historyData, localMessages]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [allMessages, sendMessage.isPending]);

  // 4. Handler Kirim Pesan
  const processMessage = async (text: string) => {
    if (sendMessage.isPending || !text.trim()) return;

    const userMsg = {
      sender: "USER",
      message: text,
      createdAt: new Date().toISOString(),
    };

    // Optimistic Update
    setLocalMessages((prev) => [...prev, userMsg]);

    try {
      const res = await sendMessage.mutateAsync({
        message: text,
        sessionId: activeSessionId,
      });

      if (res.success && res.data) {
        if (!activeSessionId) {
          setActiveSessionId(res.data.sessionId);
          localStorage.setItem("geny_session_id", res.data.sessionId);
        }
        setLocalMessages((prev) => [...prev, res.data.message]);
        refetch();
      }
    } catch (err: any) {
      // Hapus pesan terakhir di lokal jika gagal agar tidak membingungkan
      setLocalMessages((prev) => prev.slice(0, -1));

      // Error Handling dengan useToast
      toast({
        variant: "destructive",
        title: "Gagal Mengirim Pesan",
        description:
          err.response?.status === 500
            ? "Tampaknya Geny sedang berisitirahat untuk sementara waktu nih. Coba lagi nanti ya, Ma."
            : "Koneksi terputus. Pastikan internet Mama aktif.",
      });
    }
  };

  const handleReset = () => {
    // Gunakan toast atau konfirmasi simpel
    if (confirm("Hapus seluruh riwayat chat?")) {
      localStorage.removeItem("geny_session_id");
      sessionStorage.removeItem("geny_temp_msgs");
      toast({
        title: "Riwayat Dihapus",
        description: "Sesi chat baru telah dimulai.",
      });
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden">
      {/* HEADER */}
      <header className="bg-[#3AC4B6] p-5 flex items-center justify-between text-white shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/mother"
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xs uppercase tracking-[0.2em]">
              GENY AI Assistant
            </h1>
            <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest mt-0.5">
              Smart Health Companion
            </p>
          </div>
        </div>

        {activeSessionId && (
          <button
            onClick={handleReset}
            className="p-2 hover:bg-red-500 rounded-lg transition-all text-white/70 hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* CHAT AREA */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar scroll-smooth"
      >
        {isError && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center gap-2 text-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
              Gagal memuat history
            </p>
            <button
              onClick={() => refetch()}
              className="text-[10px] underline text-red-700 font-black"
            >
              COBA LAGI
            </button>
          </div>
        )}

        {allMessages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-200 gap-4">
            <Bot className="w-16 h-16 opacity-10" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 text-center px-10">
              Tanyakan Nutrisi Si Kecil
            </p>
          </div>
        )}

        {allMessages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={cn(
              "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.sender === "USER" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                msg.sender === "GENY_AI"
                  ? "bg-[#3AC4B6] text-white"
                  : "bg-white text-slate-400 border border-slate-200"
              )}
            >
              {msg.sender === "GENY_AI" ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] space-y-1",
                msg.sender === "USER" ? "text-right" : "text-left"
              )}
            >
              <div
                className={cn(
                  "p-4 rounded-[22px] text-[13px] shadow-sm leading-relaxed",
                  msg.sender === "GENY_AI"
                    ? "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                    : "bg-[#3AC4B6] text-white rounded-tr-none"
                )}
              >
                <ReactMarkdown>{msg.message}</ReactMarkdown>
              </div>
              <p className="text-[8px] font-bold text-slate-300 uppercase px-2">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {sendMessage.isPending && (
          <div className="flex items-center gap-3 ml-1">
            <div className="w-9 h-9 bg-[#3AC4B6] rounded-xl flex items-center justify-center shadow-md animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white p-4 rounded-[22px] rounded-tl-none shadow-sm flex gap-1.5 border border-slate-50">
              <span className="w-2 h-2 bg-[#3AC4B6] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-[#3AC4B6] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-[#3AC4B6] rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER & INPUT */}
      <footer className="p-6 bg-white border-t border-slate-50 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          {CHAT_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              onClick={() => processMessage(tpl.message)}
              disabled={sendMessage.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-[#3AC4B6]/10 border border-slate-100 rounded-full whitespace-nowrap transition-all active:scale-95 disabled:opacity-50 group"
            >
              <span className="text-sm group-hover:scale-125 transition-transform">
                {tpl.icon}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                {tpl.label}
              </span>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            processMessage(input);
            setInput("");
          }}
          className="relative max-w-4xl mx-auto"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sendMessage.isPending}
            placeholder="Tanya Geny..."
            className="w-full bg-slate-50 border-2 border-transparent focus:border-[#3AC4B6]/20 focus:bg-white rounded-[24px] px-7 py-5 pr-16 text-[13px] font-semibold outline-none transition-all placeholder:text-slate-300 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || sendMessage.isPending}
            className="absolute right-2.5 top-2.5 bottom-2.5 w-12 bg-[#3AC4B6] text-white rounded-[18px] flex items-center justify-center hover:bg-[#2DA89B] active:scale-90 transition-all shadow-lg shadow-teal-100 disabled:opacity-30"
          >
            {sendMessage.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </footer>
    </div>
  );
}
