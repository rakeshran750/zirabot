import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/apiRequest"; 
import axios from "axios";
import Sidebar from "./Sidebar.jsx";
import ChatBox from "./ChatBox.jsx";

const BOT_LIST = [
  { id: "estatebot", name: "EstateBot", subtitle: "Property helper" }
];

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatUI() {
  const [activeBotId, setActiveBotId] = useState(BOT_LIST[0].id);
  const [draft, setDraft] = useState("");
  const [botSearch, setBotSearch] = useState("");

  const [messagesByBot, setMessagesByBot] = useState(() => {
    const initial = {};
    for (const bot of BOT_LIST) {
      initial[bot.id] = [
        {
          id: makeId(),
          role: "assistant",
          text: `Hi! I’m ${bot.name}. How can I help you today?`,
          time: nowTime(),
        },
      ];
    }
    return initial;
  });

  const activeBot = BOT_LIST.find((b) => b.id === activeBotId);
  const activeMessages = messagesByBot[activeBotId] || [];

  function addMessage(botId, msg) {
    setMessagesByBot((prev) => ({
      ...prev,
      [botId]: [...(prev[botId] || []), msg],
    }));
  }

  function simulateBotReply(botId, userText) {
    const reply = {
      id: makeId(),
      role: "assistant",
      text: `Got it ✅ You said: "${userText}". (Hook this to your API to get real replies.)`,
      time: nowTime(),
    };
    setTimeout(() => addMessage(botId, reply), 350);
  }

//   function handleSend() {
//     const text = draft.trim();
//     if (!text) return;

//     const userMsg = {
//       id: makeId(),
//       role: "user",
//       text,
//       time: nowTime(),
//     };

//     addMessage(activeBotId, userMsg);
//     setDraft("");
//     simulateBotReply(activeBotId, text);
//   }

async function handleSend() {
  const text = draft.trim();
  if (!text) return;

  const userMsg = {
    id: makeId(),
    role: "user",
    text,
    time: nowTime(),
  };

  addMessage(activeBotId, userMsg);
  setDraft("");

  try {
    const response = await axios.post("http://192.168.56.1:5000/api/estate/ask", {
      question: text,
    });

    const botReply = {
      id: makeId(),
      role: "assistant",
      text: response?.data?.answer || "No response from bot.",
      time: nowTime(),
    };

    addMessage(activeBotId, botReply);
  } catch (error) {
    const errorReply = {
      id: makeId(),
      role: "assistant",
      text: "❌ Failed to get a reply from the server.",
      time: nowTime(),
    };

    addMessage(activeBotId, errorReply);
    console.error("API error:", error);
  }
}





  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleClear() {
    setMessagesByBot((prev) => ({
      ...prev,
      [activeBotId]: [
        {
          id: makeId(),
          role: "assistant",
          text: `Chat cleared. How can I help?`,
          time: nowTime(),
        },
      ],
    }));
  }

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-100">
      <div className="h-full w-full flex">
        <Sidebar
          bots={BOT_LIST}
          activeBotId={activeBotId}
          onBotSelect={setActiveBotId}
          messagesByBot={messagesByBot}
          botSearch={botSearch}
          setBotSearch={setBotSearch}
        />

        <ChatBox
          bot={activeBot}
          messages={activeMessages}
          draft={draft}
          setDraft={setDraft}
          onSend={handleSend}
          onClear={handleClear}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
