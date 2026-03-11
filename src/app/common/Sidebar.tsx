import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Users,
  FileText,
  Clock,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getNameInitials } from "@/lib/utils";
import { Palette } from "lucide-react";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface DocumentItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const RecentDocumentItem: React.FC<DocumentItemProps> = ({
  label,
  active = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors cursor-pointer"
  >
    <Clock className="w-4 h-4 text-gray-400" />
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
  const [userColor, setUserColor] = useState<string>("#3b82f6");
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [recentDocuments, setRecentDocuments] = useState<
    { uuid: string; title: string; teamId: number }[]
  >([]);

  const presetColors = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // violet
  ];

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

  const handleSignOut = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/logout`;
  };

  const handleColorChange = (color: string) => {
    setUserColor(color);
    apiClient
      .patch("/users/profile-color", { profileColor: color })
      .then(() => {
        dispatch(fetchMe()); // Refresh user data to get updated profile color
        setUserMenuOpen(false); // Close the user menu after selecting color
      })
      .catch((err) => {
        console.error("Error updating profile color:", err);
      });
  };

  useEffect(() => {
    apiClient
      .get("/documents/recent")
      .then((response) => {
        setRecentDocuments(response.data);
      })
      .catch((err) => {
        console.error("Error fetching recent documents:", err);
      });
  }, []);

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
                <div className="text-xs text-gray-500">CURRENT TEAM</div>
                <div className="font-semibold text-gray-900">
                  {user?.currentTeam?.name ?? "No Team"}
                </div>
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

        {/* Pinned Documents */}
        <div className="pt-6">
          <div className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Recently Viewed
          </div>
          <div className="space-y-1">
            {recentDocuments.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No recent documents
              </div>
            ) : (
              recentDocuments.map((doc) => (
                <RecentDocumentItem
                  key={doc.uuid}
                  label={doc.title}
                  onClick={() =>
                    navigate(
                      `/teams/${doc.teamId}/documents/${doc.uuid}`,
                    )
                  }
                />
              ))
            )}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              {/* profile icon */}
              <Avatar
                className="w-8 h-8 border-2 border-white ring-2 ring-slate-100 transition-transform hover:scale-110 hover:z-10"
                title={user?.name}
              >
                <AvatarFallback
                  className={`text-xs font-medium bg-gradient-to-br text-white`}
                  style={{ backgroundColor: user?.profileColor }}
                >
                  {getNameInitials(user?.name || "")}
                </AvatarFallback>
              </Avatar>

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
            <DropdownMenuItem onClick={handleSignOut}>
              Sign Out
            </DropdownMenuItem>
            <div className="px-2 py-2 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Profile Color
                </span>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                      userColor === color
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : "hover:scale-125"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TeamSwitcherModal
        open={teamSwitcherOpen}
        onOpenChange={setTeamSwitcherOpen}
        teams={user?.teams ?? []}
        currentTeamId={user?.currentTeam?.id ?? 0}
        handleTeamSelect={handleTeamSelect}
        onCreateTeam={() => {
          setTeamCreateModalOpen(true);
          setTeamSwitcherOpen(false);
        }}
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
