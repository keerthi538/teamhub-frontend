import React, { useState, KeyboardEvent, SetStateAction } from "react";
import { X, Globe } from "lucide-react";

interface Member {
  id: string;
  email: string;
  avatar?: string;
}

export default function CreateTeamModal({
  isOpen,
  setIsOpen,
  handleCreateTeam,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleCreateTeam: (teamName: string) => void;
}) {
  const [teamName, setTeamName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [members, setMembers] = useState<Member[]>([]);

  const handleAddMember = () => {
    if (emailInput.trim() && emailInput.includes("@")) {
      setMembers([
        ...members,
        { id: Date.now().toString(), email: emailInput.trim() },
      ]);
      setEmailInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddMember();
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleCreate = () => {
    handleCreateTeam(teamName);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Team
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Set up a team and invite collaborators.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Team Name */}
          <div>
            <label
              htmlFor="team-name"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Team Name
            </label>
            <input
              id="team-name"
              type="text"
              placeholder="e.g. Frontend Engineering"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Invite Members */}
          <div>
            <label
              htmlFor="email-input"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Invite Members
            </label>
            <div className="relative">
              <input
                disabled // Disable input for now, as backend integration is pending
                id="email-input"
                type="email"
                placeholder="Enter email addresses..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleAddMember}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                @
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or comma to add each email.
            </p>

            {/* Member Tags */}
            {members.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-2.5 py-1.5 rounded-md group hover:bg-gray-200 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                      {member.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm">{member.email}</span>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Members Count */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-blue-600 font-semibold text-sm">
                {members.length}
              </span>
              <span className="text-gray-600 text-sm uppercase tracking-wide">
                Members Added
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={teamName.trim().length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
}
