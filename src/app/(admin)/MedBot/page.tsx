"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useState, useEffect, useRef } from "react";

interface ChatMsg {
  role: "user" | "bot";
  text?: string;
  answer?: any;
}

export default function MedicalBotPage() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"normal" | "summary">("normal");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);


  const renderAnswerUI = (ans: any) => {
    if (!ans) return <p>No data available</p>;

    return (
      <div className="space-y-4 text-sm">

        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl">
          <h4 className="font-semibold text-green-400 mb-1">🧠 Analysis</h4>
          <p className="text-gray-200">
            {ans.bot_analysis || "No analysis available"}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="font-semibold text-blue-400 mb-2">💊 Medicines</h4>

          {ans.medicines?.length ? (
            ans.medicines.map((m: any, i: number) => (
              <div key={i} className="bg-gray-900 p-3 rounded-lg mb-2 border border-gray-700">
                <p><span className="text-gray-400">Name:</span> {m.name}</p>
                <p><span className="text-gray-400">Dose:</span> {m.dose}</p>
                <p><span className="text-gray-400">Purpose:</span> {m.purpose}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No medicines suggested</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="font-semibold text-yellow-400 mb-2">🏃 Exercises</h4>

          {ans.exercises?.length ? (
            ans.exercises.map((e: any, i: number) => (
              <div key={i} className="bg-gray-900 p-3 rounded-lg mb-2 border border-gray-700">
                <p>{e.name}</p>
                <p className="text-gray-400 text-xs">{e.duration}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No exercises recommended</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="font-semibold text-pink-400 mb-2">🌿 Lifestyle</h4>

          {ans.lifestyle_advice?.length ? (
            ans.lifestyle_advice.map((l: any, i: number) => (
              <div key={i} className="bg-gray-900 p-3 rounded-lg mb-2 border border-gray-700">
                {l.tip}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No lifestyle advice</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setMode("summary")}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full text-xs"
          >
            📄 Summary Mode
          </button>

          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-xs">
            👨‍⚕️ Book Doctor
          </button>
        </div>
      </div>
    );
  };

  // ✅ Ask Doctor
  const askDoctor = async () => {
    if (!question.trim()) return;

    const userMsg = question;

    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: userMsg,
          mode: mode 
        })
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "bot", answer: data.answer }
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "❌ Server error. Try again1." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="MedBot" />

      <div className="h-[85vh] flex flex-col border rounded-2xl bg-black text-white shadow-lg">

        {/* HEADER */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold text-lg">🩺 AI Medical Assistant</h2>

   
          <button
            onClick={() =>
              setMode((prev) => (prev === "normal" ? "summary" : "normal"))
            }
            className={`px-4 py-2 rounded-lg text-sm transition ${
              mode === "summary"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {mode === "summary" ? "📄 Summary ON" : "Summary Mode"}
          </button>
        </div>

        {/* CHAT / EMPTY */}
        <div className="flex-1 overflow-y-auto p-6">

          {chat.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <h1 className="text-3xl font-semibold text-white mb-3">
                👋 How are you today?
              </h1>
              <p className="text-lg">
                What medical question would you like to ask?
              </p>

              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {["Fever", "Headache", "Cold", "Anxiety"].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(item)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-4 rounded-2xl shadow-md ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-800 text-white rounded-bl-none"
                    }`}
                  >
                    {msg.role === "bot"
                      ? msg.answer
                        ? renderAnswerUI(msg.answer)
                        : msg.text
                      : msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-gray-400 text-sm animate-pulse">
                  🤖 {mode === "summary" ? "Summarizing..." : "Analyzing..."}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="border-t border-gray-700 p-4 flex gap-3 bg-black">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. I have headache and fever..."
            className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            onClick={askDoctor}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}