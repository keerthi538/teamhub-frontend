import { useState } from "react";
import type { Team } from "../types";

export function TeamSwitcher({
  teams,
  currentTeam,
  onSelect,
}: {
  teams: Team[];
  currentTeam: Team | null;
  onSelect: (team: Team) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md bg-[#f6f8ff] px-3 py-1.5 text-sm font-medium text-[#4f7cff] hover:bg-[#e9efff]"
      >
        {currentTeam ? currentTeam.name : "Select team"}
        <span className="text-xs">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-56 rounded-lg border border-[#e6ebf5] bg-white shadow-md z-20">
          <div className="py-1">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => {
                  onSelect(team);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-[#f6f8ff] ${
                  currentTeam?.id === team.id
                    ? "font-medium text-[#4f7cff]"
                    : "text-[#0b1220]"
                }`}
              >
                {team.name}
              </button>
            ))}
          </div>

          <div className="border-t border-[#e6ebf5]">
            <button className="w-full px-4 py-2 text-left text-sm text-[#4f7cff] hover:bg-[#f6f8ff]">
              + Create new team
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
