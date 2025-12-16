// components/ChatBox.js
import React, { useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

function MessageBubble3({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={["flex", isUser ? "justify-end" : "justify-start"].join(" ")}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-3 border",
          isUser
            ? "bg-indigo-600 border-indigo-500"
            : "bg-slate-900 border-slate-800",
        ].join(" ")}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
        <div className="mt-1 text-[10px] opacity-80 text-right">{msg.time}</div>
      </div>
    </div>
  );
}


function MessageBubble2({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={["flex", isUser ? "justify-end" : "justify-start"].join(" ")}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-3 border",
          isUser
            ? "bg-indigo-600 border-indigo-500 text-white"
            : "bg-slate-900 border-slate-800 text-slate-100",
        ].join(" ")}
      >
        <div className="prose prose-invert text-sm leading-relaxed whitespace-pre-wrap">
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
        <div className="mt-1 text-[10px] opacity-80 text-right">{msg.time}</div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={["flex", isUser ? "justify-end" : "justify-start"].join(" ")}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-3 border",
          isUser
            ? "bg-indigo-600 border-indigo-500 text-white"
            : "bg-slate-900 border-slate-800 text-slate-100",
        ].join(" ")}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {true ? (
            <div
              dangerouslySetInnerHTML={{ __html: msg.text }}
              className="space-y-4"
            />
          ) : (
            <div className="prose prose-invert">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className="mt-1 text-[10px] opacity-80 text-right">{msg.time}</div>
      </div>
    </div>
  );
}

export default function ChatBox({
  bot,
  messages,
  draft,
  setDraft,
  onSend,
  onClear,
  onKeyDown,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4">
        <div>
          <div className="font-semibold">{bot?.name}</div>
          <div className="text-xs text-slate-400">{bot?.subtitle}</div>
        </div>
        <button
          onClick={onClear}
          className="text-xs px-3 py-2 rounded-xl border border-slate-800 hover:bg-slate-900"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-slate-800 bg-slate-950 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-600"
          />
          <button
            onClick={onSend}
            className="rounded-2xl px-4 py-3 bg-indigo-600 hover:bg-indigo-500 font-medium text-sm"
          >
            Send
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-2 text-[11px] text-slate-500">
          Tip: replace <span className="text-slate-300">simulateBotReply()</span> with your backend API.
        </div>
      </div>
    </main>
  );
}
