"use client";

import { useState, useRef, useEffect } from "react";
import { IoSend as SendIcon } from "react-icons/io5";
import { BsRobot as RobotIcon } from "react-icons/bs";
import { FaUser as UserIcon } from "react-icons/fa";
import { HiSparkles as SparklesIcon } from "react-icons/hi2";
import { RiDeleteBin6Line as ClearIcon } from "react-icons/ri";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Apa saja tech stack yang dikuasai Rafli?",
  "Ceritakan pengalaman kerja Rafli",
  "Project apa saja yang pernah dibuat?",
  "Apa sertifikasi yang dimiliki Rafli?",
  "Bagaimana cara menghubungi Rafli?",
];

const STORAGE_KEY = "smarttalk_history";

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Halo! 👋 Saya **SmartTalk**, asisten AI untuk portfolio Rafli Bima Pratandra.\n\nSaya bisa menjawab pertanyaan seputar pengalaman kerja, skills, project, sertifikasi, dan informasi profesional Rafli. Silakan tanya apa saja!",
};

const SmartTalk = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load history from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  // Save history to sessionStorage whenever messages change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore storage errors
    }
  }, [messages, isHydrated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/smart-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kesalahan saat memproses pertanyaan kamu. Silakan coba lagi.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <RobotIcon size={20} className="text-neutral-900" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-neutral-900 dark:text-white">SmartTalk</h2>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
          <p className="text-xs text-neutral-500">Powered by Gemini AI · Portfolio Assistant</p>
        </div>
        {messages.length > 1 && (
          <button
            onClick={clearChat}
            title="Clear chat history"
            className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-neutral-400 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <ClearIcon size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((msg, i) => (
          <div
          key={`${msg.role}-${i}`}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                msg.role === "user"
                  ? "bg-primary text-neutral-900"
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            >
              {msg.role === "user" ? (
                <UserIcon size={14} />
              ) : (
                <RobotIcon size={14} className="text-neutral-600 dark:text-neutral-300" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-tr-sm bg-primary text-neutral-900"
                  : "rounded-tl-sm bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
              }`}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  ul: ({ children }) => <ul className="mb-1 ml-4 list-disc space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-1 ml-4 list-decimal space-y-0.5">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">
                      {children}
                    </a>
                  ),
                  code: ({ children }) => <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-xs dark:bg-white/10">{children}</code>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
              <RobotIcon size={14} className="text-neutral-600 dark:text-neutral-300" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions (only show at start) */}
      {messages.length === 1 && (
        <div className="border-t border-neutral-200 px-5 py-3 dark:border-neutral-800">
          <div className="mb-2 flex items-center gap-1.5 text-xs text-neutral-400">
            <SparklesIcon size={12} />
            <span>Pertanyaan yang sering ditanyakan</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
              key={`suggested-${i}`}
                onClick={() => sendMessage(q)}
                className="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs text-neutral-600 transition-all hover:border-primary hover:bg-primary/10 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-primary dark:hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <div className="flex items-end gap-2 rounded-xl border border-neutral-300 bg-white p-2 focus-within:border-primary dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:border-primary">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya seputar Rafli... (Enter untuk kirim)"
            rows={1}
            disabled={isLoading}
            className="max-h-32 flex-1 resize-none bg-transparent px-1 py-1 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-wait dark:text-white"
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-neutral-900 transition-all hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendIcon size={15} />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-neutral-400">
          SmartTalk hanya menjawab pertanyaan seputar portfolio Rafli Bima Pratandra
        </p>
      </div>
    </div>
  );
};

export default SmartTalk;
