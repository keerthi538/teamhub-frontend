import { useState } from "react";

export function CreateTeamModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (teamName: string) => void;
}) {
  const [teamName, setTeamName] = useState("");

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center w-dvw h-dvh">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[#0b1220]">
          Create a new team
        </h2>
        <p className="mt-1 text-sm text-[#5b6b8a]">
          Give your team a name. You can change this later.
        </p>

        {/* Input */}
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-[#0b1220]">
            Team name
          </label>
          <input
            autoFocus
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g. Engineering"
            className="w-full rounded-lg border border-[#e6ebf5] px-3 py-2 text-sm focus:border-[#4f7cff] focus:outline-none focus:ring-2 focus:ring-[#4f7cff]/30"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#0b1220] hover:bg-[#f6f8ff]"
          >
            Cancel
          </button>
          <button
            disabled={!teamName.trim()}
            onClick={() => onCreate(teamName.trim())}
            className="rounded-lg bg-[#4f7cff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3f6cf3] disabled:opacity-50"
          >
            Create team
          </button>
        </div>
      </div>
    </div>
  );
}
