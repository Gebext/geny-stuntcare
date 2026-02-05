import { useState } from "react";
import api from "@/lib/axios";
import { Loader2, Activity, Info, CheckCircle, AlertTriangle } from "lucide-react";

interface AiRecommendation {
  status: string; // AMAN, RISIKO
  summary: string;
  recommendations: string[];
}

export default function PregnancyAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiRecommendation | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await api.post("/mother/analyze-pregnancy");
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan analisis. Pastikan profil lengkap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-700 flex items-center gap-2">
          <Activity className="w-5 h-5 text-pink-500" />
          Analisis Kesehatan Kehamilan (AI)
        </h3>
        {!result && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-4 py-2 bg-pink-500 text-white text-xs font-bold rounded-full hover:bg-pink-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Menganalisis..." : "Mulai Analisis"}
          </button>
        )}
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              result.status === "AMAN"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {result.status === "AMAN" ? (
              <CheckCircle className="w-6 h-6 shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 shrink-0" />
            )}
            <div>
              <p className="font-extrabold text-sm uppercase mb-1">
                Status: {result.status}
              </p>
              <p className="text-sm font-medium leading-relaxed">
                {result.summary}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
              Rekomendasi Medis
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600 font-medium"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-black">{idx + 1}</span>
                  </div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
          
          <button
            onClick={handleAnalyze}
            className="w-full py-3 text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Analisis Ulang
          </button>
        </div>
      )}
    </div>
  );
}
