// components/Sidebar.js
import React from "react";

export default function Sidebar({
  bots,
  activeBotId,
  messagesByBot,
  onBotSelect,
  botSearch,
  setBotSearch,
}) {
  const filteredBots = bots.filter((b) => {
    const q = botSearch.trim().toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      (b.subtitle || "").toLowerCase().includes(q)
    );
  });

  return (
    <aside className="w-[320px] border-r border-slate-800 bg-slate-950">
      <div className="p-4 border-b border-slate-800">
        <div className="text-lg font-semibold">Chatbots</div>
        <div className="text-xs text-slate-400 mt-1">
          Select a bot and start chatting
        </div>

        <div className="mt-3">
          <input
            value={botSearch}
            onChange={(e) => setBotSearch(e.target.value)}
            placeholder="Search bots..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-600"
          />
        </div>
      </div>

      <div className="p-2 overflow-auto">
        {filteredBots.map((bot) => {
          const isActive = bot.id === activeBotId;
          const lastMsg = (messagesByBot[bot.id] || []).slice(-1)[0];
          return (
            <button
              key={bot.id}
              onClick={() => onBotSelect(bot.id)}
              className={[
                "w-full text-left p-3 rounded-xl transition",
                isActive
                  ? "bg-slate-900 border border-slate-700"
                  : "hover:bg-slate-900/60",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div
                  className={[
                    "h-10 w-10 rounded-xl flex items-center justify-center font-bold",
                    isActive ? "bg-indigo-600" : "bg-slate-800",
                  ].join(" ")}
                >
                  {bot.name.slice(0, 1)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold truncate">{bot.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {lastMsg?.time || ""}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {lastMsg?.text || bot.subtitle || ""}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {filteredBots.length === 0 && (
          <div className="p-4 text-sm text-slate-400">
            No bots found for “{botSearch}”
          </div>
        )}
      </div>
    </aside>
  );
}
