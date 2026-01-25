import axios from "axios";
import type { Team } from "../types";
import { CreateTeamModal } from "./CreateTeamModal";
import { TeamSwitcher } from "./TeamSwitcher";
import { useState } from "react";

interface NavbarProps {
  currentTeam: Team | null;
  userName: string;
  teams: Array<{ id: number; name: string }>;
}

const Navbar = ({ userName, teams, currentTeam }: NavbarProps) => {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  const createTeam = (teamName: string) => {
    setIsCreateTeamOpen(false);
    axios
      .post(
        "http://localhost:3000/teams/create",
        {
          teamName,
        },
        { withCredentials: true },
      )
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((err) => {
        console.error("Error creating team:", err);
      });
  };

  return (
    <header className="sticky top-0 z-10 border-b border-[#e6ebf5] bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-[#0b1220]">TeamHub</span>

          <TeamSwitcher
            teams={teams}
            currentTeam={currentTeam}
            onSelect={(team) => console.log("Team selected: ", team)}
            setIsCreateTeamOpen={setIsCreateTeamOpen}
          />
        </div>

        {/* Center */}
        <div className="hidden w-full max-w-md md:block">
          <input
            placeholder="Search documents..."
            className="w-full rounded-lg border border-[#e6ebf5] px-4 py-2 text-sm focus:border-[#4f7cff] focus:outline-none focus:ring-2 focus:ring-[#4f7cff]/30"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4f7cff] text-sm font-semibold text-white">
            {userName[0]}
          </div>
          <span className="hidden text-sm font-medium text-[#0b1220] md:block">
            {userName}
          </span>
          <button className="rounded-md border border-[#e6ebf5] px-3 py-1.5 text-sm font-medium text-[#0b1220] hover:bg-[#f6f8ff]">
            Logout
          </button>
        </div>
      </div>
      <CreateTeamModal
        open={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        onCreate={createTeam}
      />
    </header>
  );
};

export default Navbar;
