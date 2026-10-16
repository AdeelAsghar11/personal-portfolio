"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  MessageCircle,
  Send,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";

// ── Constants ───────────────────────────────────────────────────────────────
const MAX_INPUT = 1000; // mirrors MAX_QUERY_LENGTH on the server.
const WARN_AT = 900; // live counter turns to a warning color near the limit.

// FOUR suggested starters (exact labels). Shown only when the conversation is
// empty; clicking a chip fills + sends immediately.
const STARTERS = [
  "What's Adeel's strongest project?",
  "Tell me about the hackathon wins",
  "What's his AI/ML tech stack?",
  "What's his experience and education?",
] as const;

type ErrorKind = "400" | "429" | "500" | "network";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  done: boolean;
  rating?: "up" | "down";
};

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `m${idCounter}`;
}

function errorMessage(kind: ErrorKind): string {
  switch (kind) {
    case "400":
      return "I couldn't read that — try rephrasing your question.";
    case "429":
      return "I'm getting a lot of questions right now, try again in a moment";
    default:
      return "Something went wrong on my side. Please try again.";
  }
}

// ── Lightweight, safe markdown rendering ──────────────────────────────────────
// Renders a minimal markdown subset (bold, italic, inline code, links) to React
// elements WITHOUT dangerouslySetInnerHTML, so raw model output can never inject
// HTML. Block-level handling covers paragraphs and bullet lists only.

// Parse inline spans: **bold**, *italic* / _italic_, `code`, [text](url).
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Order matters: code first (so * inside code isn't treated as emphasis),
  // then links, then bold, then italic.
  const pattern =
    /(`[^`]+`)|(\[[^\]]+\]\((?:https?:\/\/|mailto:|#)[^\s)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="font-mono text-[0.85em] rounded px-1 py-0.5 bg-[var(--bg-tertiary)] text-[var(--accent-cyan)]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^\s)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const external = /^https?:\/\//.test(href);
        nodes.push(
          <a
            key={key}
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="text-[var(--accent-cyan)] underline underline-offset-2 hover:text-[var(--accent-green)] transition-colors"
          >
            {label}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-[var(--text-primary)]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      // *italic* or _italic_
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// Split text into blocks (paragraphs + bullet lists) and render each.
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let listOrdered = false;
  let b = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const content = paragraph.join(" ");
    blocks.push(
      <p key={`p-${b++}`} className="whitespace-pre-wrap break-words">
        {renderInline(content, `p${b}`)}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (list.length === 0) return;
    const items = list.map((item, idx) => (
      <li key={idx} className="break-words">
        {renderInline(item, `li${b}-${idx}`)}
      </li>
    ));
    blocks.push(
      listOrdered ? (
        <ol key={`ol-${b++}`} className="list-decimal pl-5 flex flex-col gap-1">
          {items}
        </ol>
      ) : (
        <ul key={`ul-${b++}`} className="list-disc pl-5 flex flex-col gap-1">
          {items}
        </ul>
      ),
    );
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (bullet) {
      flushParagraph();
      if (listOrdered) flushList();
      listOrdered = false;
      list.push(bullet[1]);
    } else if (ordered) {
      flushParagraph();
      if (!listOrdered) flushList();
      listOrdered = true;
      list.push(ordered[1]);
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return <div className="flex flex-col gap-2">{blocks}</div>;
}

export default function ChatWidget() {
  const shouldReduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<{ kind: ErrorKind } | null>(null);
  const [lastQuery, setLastQuery] = useState("");

  const bubbleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the latest message as content streams in.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [messages, shouldReduceMotion]);

  // Focus management: move focus into the panel on open, return it to the
  // bubble on close.
  useEffect(() => {
    if (open) {
      // Defer so the panel is in the DOM before focusing.
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
    bubbleRef.current?.focus();
  }, [open]);

  // Esc-to-close + focus trap while the dialog is open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_INPUT || streaming) return;

    const assistantId = nextId();
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: trimmed, done: true },
      { id: assistantId, role: "assistant", text: "", done: false },
    ]);
    setInput("");
    setError(null);
    setLastQuery(trimmed);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok || !res.body) {
        let kind: ErrorKind = "500";
        if (res.status === 400) kind = "400";
        else if (res.status === 429) kind = "429";
        else kind = "500";
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError({ kind });
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, text: m.text + chunk } : m,
          ),
        );
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                done: true,
                text: m.text.trim()
                  ? m.text
                  : "I don't have anything on that yet.",
              }
            : m,
        ),
      );
      setStreaming(false);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      setError({ kind: "network" });
      setStreaming(false);
    }
  }

  function rateMessage(message: ChatMessage) {
    const idx = messages.findIndex((m) => m.id === message.id);
    const question =
      idx > 0 && messages[idx - 1]?.role === "user"
        ? messages[idx - 1].text
        : "";
    return (rating: "up" | "down") => {
      if (message.rating) return; // one rating per message — lock after click.
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, rating } : m)),
      );
      // Fire-and-forget: don't await, don't block UI, ignore failures.
      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, question, answer: message.text }),
      }).catch(() => {});
    };
  }

  const overLimit = input.length > MAX_INPUT;
  const sendDisabled = input.trim() === "" || overLimit || streaming;

  function onInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !streaming) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      {/* ── Floating bubble ── */}
      <motion.button
        ref={bubbleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        aria-expanded={open}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full flex items-center justify-center text-white dark:text-[#060913] transition-shadow duration-300"
        style={{
          background: "linear-gradient(135deg, var(--accent-cyan), #38bdf8)",
          boxShadow: "0 0 24px rgba(0, 240, 255, 0.35)",
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatwidget-title"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="fixed z-[300] flex flex-col rounded-lg border border-[var(--border-color)] backdrop-blur-md overflow-hidden w-[calc(100vw-2rem)] sm:w-[380px] max-h-[70vh] bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))]"
            style={{
              background: "var(--card-bg-gradient)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] shrink-0" />
                <span className="font-mono text-sm text-[var(--text-primary)] flex items-center min-w-0">
                  <span className="text-[var(--accent-green)] mr-1.5 select-none">
                    &gt;
                  </span>
                  <span id="chatwidget-title" className="truncate">
                    Ask about Adeel
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-9 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 hover:border-[var(--accent-cyan)]/40 hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <X className="w-4 h-4 text-[var(--accent-cyan)]" />
              </button>
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {messages.length === 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-xs text-[var(--text-secondary)]">
                    Try one of these:
                  </p>
                  <div className="flex flex-col gap-2">
                    {STARTERS.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => send(label)}
                        className="text-left font-mono text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-secondary)] hover:border-[var(--accent-cyan)]/40 hover:text-[var(--accent-cyan)] transition-colors"
                      >
                        <span className="text-[var(--accent-green)] mr-2 select-none">
                          &gt;
                        </span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                  const isUser = m.role === "user";
                  const isStreamingEmpty =
                    m.role === "assistant" && !m.done && m.text === "";
                  const onRate = rateMessage(m);
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 ${
                          isUser
                            ? "bg-[var(--bg-tertiary)]"
                            : "bg-[var(--bg-secondary)]"
                        }`}
                      >
                        {isStreamingEmpty ? (
                          shouldReduceMotion ? (
                            <span className="font-sans text-sm text-[var(--text-muted)]">
                              …
                            </span>
                          ) : (
                            <span
                              className="flex items-center gap-1 py-1"
                              aria-label="Assistant is typing"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse [animation-delay:150ms]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse [animation-delay:300ms]" />
                            </span>
                          )
                        ) : isUser ? (
                          <p className="whitespace-pre-wrap break-words font-sans text-sm text-[var(--text-primary)]">
                            {m.text}
                          </p>
                        ) : (
                          <div className="font-sans text-sm text-[var(--text-primary)] leading-relaxed">
                            {renderMarkdown(m.text)}
                          </div>
                        )}
                      </div>

                      {/* Feedback on completed, non-empty assistant messages */}
                      {m.role === "assistant" && m.done && m.text && (
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => onRate("up")}
                            disabled={Boolean(m.rating)}
                            aria-label="Helpful"
                            aria-pressed={m.rating === "up"}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-green)] disabled:cursor-default transition-colors"
                          >
                            <ThumbsUp
                              className={`w-3.5 h-3.5 ${
                                m.rating === "up"
                                  ? "text-[var(--accent-green)]"
                                  : ""
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRate("down")}
                            disabled={Boolean(m.rating)}
                            aria-label="Not helpful"
                            aria-pressed={m.rating === "down"}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-violet)] disabled:cursor-default transition-colors"
                          >
                            <ThumbsDown
                              className={`w-3.5 h-3.5 ${
                                m.rating === "down"
                                  ? "text-[var(--accent-violet)]"
                                  : ""
                              }`}
                            />
                          </button>
                          {m.rating && (
                            <span className="font-mono text-xs text-[var(--accent-green)]">
                              thanks
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {error && (
                <div className="flex flex-col gap-2 font-sans text-xs border-l-2 border-[var(--accent-violet)] pl-3 py-1">
                  <p className="text-[var(--text-secondary)]">
                    {errorMessage(error.kind)}
                  </p>
                  <div className="flex items-center gap-3">
                    {lastQuery && (
                      <button
                        type="button"
                        onClick={() => send(lastQuery)}
                        className="font-mono text-xs text-[var(--accent-cyan)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        ↻ Retry
                      </button>
                    )}
                    <a
                      href="mailto:adeelyt157@gmail.com"
                      className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors"
                    >
                      Email Adeel ↗
                    </a>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input row */}
            <div className="border-t border-[var(--border-color)] px-4 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  rows={1}
                  placeholder="Ask a question…"
                  aria-label="Your question"
                  className="flex-1 resize-none max-h-28 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-cyan)]/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => send(input)}
                  disabled={sendDisabled}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white dark:text-[#060913] disabled:opacity-40 disabled:cursor-default transition-opacity"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent-cyan), #38bdf8)",
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-1.5 text-right">
                <span
                  className={`font-mono text-xs ${
                    input.length > WARN_AT
                      ? "text-[var(--accent-violet)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {input.length}/{MAX_INPUT}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
