import { Check, Plus, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Team } from "../types";

interface TeamSwitcherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[];
  currentTeamId: number;
  handleTeamSelect: (team: Team) => void;
  onCreateTeam?: () => void;
  onManageTeams?: () => void;
}

export function TeamSwitcherModal({
  open,
  onOpenChange,
  teams,
  currentTeamId,
  handleTeamSelect,
  onCreateTeam,
  onManageTeams,
}: TeamSwitcherModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-[320px]">
        <DialogHeader className="px-4 pt-4 pb-3">
          <DialogTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Select team
          </DialogTitle>
        </DialogHeader>

        <div className="px-2 pb-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team)}
              className={cn(
                "w-full flex items-center gap-3 my-1 px-2 py-2 rounded-md hover:bg-accent transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-md flex items-center justify-center text-white font-semibold flex-shrink-0",
                  team.id === currentTeamId ? "bg-black" : "bg-olive-600",
                )}
              >
                {team.name[0]}
              </div>

              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{team.name}</div>
                {/* Can add this later */}
                {/* <div className="text-xs text-muted-foreground">
                  {`${team.members} members`}
                </div> */}
              </div>

              {team.id === currentTeamId && (
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              )}
            </button>
          ))}

          <div className="h-px bg-border my-2" />

          {onCreateTeam && (
            <button
              onClick={onCreateTeam}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="w-10 h-10 rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Create new team</div>
              </div>
            </button>
          )}

          {onManageTeams && (
            <button
              onClick={onManageTeams}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Manage teams</div>
              </div>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
