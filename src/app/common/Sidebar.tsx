import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  ChevronDown,
  Settings,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMe, createTeam, selectUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { selectActiveNav, setActiveNav } from "../store/globalSlice";
import { TeamSwitcherModal } from "../components/TeamSwitcher";
import type { Team } from "../types";
import apiClient from "@/lib/axios";
import CreateTeamModal from "../components/CreateTeamModal";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface PinnedDocumentItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const PinnedDocumentItem: React.FC<PinnedDocumentItemProps> = ({
  label,
  active = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
  >
    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    <span>{label}</span>
  </button>
);

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
      active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const Sidebar = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const activeNav = useAppSelector(selectActiveNav);
  const dispatch = useAppDispatch();
  const [teamSwitcherOpen, setTeamSwitcherOpen] = useState(false);
  const [teamCreateModalOpen, setTeamCreateModalOpen] = useState(false);

  const handleNavItemClick = (label: string) => {
    dispatch(setActiveNav(label));
    // Navigate to corresponding route
    switch (label) {
      case "Documents":
        navigate("/");
        break;
      case "Team Members":
        navigate("/team");
        break;
      case "Settings":
        navigate("/settings");
        break;
      default:
        break;
    }
  };

  const handleTeamSelect = (team: Team) => {
    apiClient
      .post(`/teams/${team.id}/switch`, {}, { withCredentials: true })
      .then(() => {
        setTeamSwitcherOpen(false);
        dispatch(fetchMe());
      })
      .catch((err) => {
        console.error("Error switching team:", err);
      });
  };

  const handleCreateTeam = (teamName: string) => {
    dispatch(createTeam(teamName));
  };

  return (
    <aside className="w-64 border-r border-gray-200 flex flex-col">
      {/* Company Header */}
      <div className="p-4 border-b border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">
                  {user?.currentTeam?.name}
                </div>
                <div className="text-xs text-gray-500">ENTERPRISE TEAM</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => setTeamSwitcherOpen(true)}>
              Switch Team
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTeamCreateModalOpen(true)}>
              Create New Team
            </DropdownMenuItem>
            <DropdownMenuItem>Team Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <SidebarNavItem
          icon={FileText}
          label="Documents"
          active={activeNav === "Documents"}
          onClick={() => handleNavItemClick("Documents")}
        />
        <SidebarNavItem
          icon={Users}
          label="Team Members"
          active={activeNav === "Team Members"}
          onClick={() => handleNavItemClick("Team Members")}
        />
        <SidebarNavItem
          icon={Settings}
          label="Settings"
          active={activeNav === "Settings"}
          onClick={() => setActiveNav("Settings")}
        />

        {/* Pinned Documents */}
        <div className="pt-6">
          <div className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Pinned Documents
          </div>
          <div className="space-y-1">
            <PinnedDocumentItem label="API Specifications" />
            <PinnedDocumentItem label="Product Roadmap" />
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              {/* profile icon */}
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 text-sm">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TeamSwitcherModal
        open={teamSwitcherOpen}
        onOpenChange={setTeamSwitcherOpen}
        teams={user?.teams ?? []}
        currentTeamId={user?.currentTeam?.id ?? 0}
        handleTeamSelect={handleTeamSelect}
        onCreateTeam={() => console.log("Create team")}
        onManageTeams={() => console.log("Manage teams")}
      />

      <CreateTeamModal
        isOpen={teamCreateModalOpen}
        setIsOpen={setTeamCreateModalOpen}
        handleCreateTeam={handleCreateTeam}
      />
    </aside>
  );
};

export default Sidebar;
