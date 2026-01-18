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
import { useToast } from "@/hooks/use-toast";

const CHAT_TEMPLATES = [
  {
    label: "Gizi",
    message: "Geny, bagaimana status gizi anak saya?",
    icon: "📊",
  },
  { label: "MPASI", message: "Berikan saran menu MPASI bergizi.", icon: "🥗" },
  {
    label: "Vaksin",
    message: "Kapan jadwal imunisasi berikutnya?",
    icon: "💉",
  },
];

export default function GenyChatPage() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem("geny_session_id");
    const savedLocalMsgs = sessionStorage.getItem("geny_temp_msgs");
    if (savedSession && savedSession !== "null")
      setActiveSessionId(savedSession);
    if (savedLocalMsgs) setLocalMessages(JSON.parse(savedLocalMsgs));
  }, []);

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
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [historyData, localMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [allMessages, sendMessage.isPending]);

  const processMessage = async (text: string) => {
    if (sendMessage.isPending || !text.trim()) return;
    const userMsg = {
      sender: "USER",
      message: text,
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, userMsg]);
    setInput("");

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
      setLocalMessages((prev) => prev.slice(0, -1));
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Koneksi terputus. Coba lagi ya, Ma.",
      });
    }
  };

  const handleReset = () => {
    if (confirm("Hapus seluruh riwayat chat?")) {
      localStorage.removeItem("geny_session_id");
      sessionStorage.removeItem("geny_temp_msgs");
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white md:rounded-[35px] shadow-2xl md:border border-slate-100 overflow-hidden relative">
      {/* HEADER - Sticky at Top */}
      <header className="bg-[#3AC4B6] p-4 md:p-5 flex items-center justify-between text-white shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/dashboard/mother"
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-[10px] md:text-xs uppercase tracking-[0.15em] truncate">
              GENY Assistant
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <p className="text-[8px] md:text-[9px] font-bold opacity-80 uppercase tracking-widest">
                Online
              </p>
            </div>
          </div>
        </div>

        {activeSessionId && (
          <button
            onClick={handleReset}
            className="p-2.5 hover:bg-red-500 rounded-xl transition-all text-white/80"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* CHAT AREA - Flexible Height */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 custom-scrollbar"
      >
        {allMessages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-40">
            <Sparkles className="w-12 h-12" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">
              Mulai Konsultasi Nutrisi
            </p>
          </div>
        )}

        {allMessages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={cn(
              "flex items-start gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.sender === "USER" ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 shadow-sm text-[10px]",
                msg.sender === "GENY_AI"
                  ? "bg-[#3AC4B6] text-white"
                  : "bg-white text-slate-400 border border-slate-200",
              )}
            >
              {msg.sender === "GENY_AI" ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>

            <div
              className={cn(
                "max-w-[85%] md:max-w-[75%] space-y-1",
                msg.sender === "USER" ? "text-right" : "text-left",
              )}
            >
              <div
                className={cn(
                  "p-3.5 md:p-4 rounded-[20px] text-xs md:text-[13px] shadow-sm leading-relaxed overflow-hidden break-words",
                  msg.sender === "GENY_AI"
                    ? "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                    : "bg-[#3AC4B6] text-white rounded-tr-none",
                )}
              >
                <div className="prose prose-sm prose-slate max-w-none">
                  <ReactMarkdown>
                    {msg.message}
                  </ReactMarkdown>
                </div>
              </div>
              <p className="text-[7px] md:text-[8px] font-black text-slate-300 uppercase px-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {sendMessage.isPending && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3AC4B6] rounded-lg flex items-center justify-center animate-bounce shadow-lg shadow-teal-100">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 border border-slate-100">
              <span className="w-1.5 h-1.5 bg-[#3AC4B6] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-[#3AC4B6] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-[#3AC4B6] rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER & INPUT - Always Visible */}
      <footer className="p-4 md:p-6 bg-white border-t border-slate-50 shrink-0">
        {/* Templates Mobile: Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CHAT_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              onClick={() => processMessage(tpl.message)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-teal-50 border border-slate-100 rounded-full whitespace-nowrap active:scale-95 transition-all group shrink-0"
            >
              <span className="text-xs">{tpl.icon}</span>
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider group-hover:text-[#3AC4B6]">
                {tpl.label}
              </span>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            processMessage(input);
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya Geny..."
              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#3AC4B6]/20 focus:bg-white rounded-[20px] md:rounded-[24px] px-5 py-4 pr-12 text-xs md:text-sm font-semibold outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || sendMessage.isPending}
              className="absolute right-2 top-2 bottom-2 w-10 md:w-11 bg-[#3AC4B6] text-white rounded-[16px] md:rounded-[18px] flex items-center justify-center hover:bg-[#2DA89B] active:scale-90 transition-all disabled:opacity-20 shadow-lg shadow-teal-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
