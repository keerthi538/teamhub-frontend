import React, { useState } from "react";
import { Team } from "../types";
import { Button } from "@/components/ui/button";
import CreateTeamModal from "./CreateTeamModal";
import { useAppDispatch } from "../store/hooks";
import { createTeam } from "../store/userSlice";

interface EmptyDocumentListProps {
  currentTeam: Team | null;
  handleCreateDocument: () => void;
}

const EmptyDocumentList = ({
  currentTeam,
  handleCreateDocument,
}: EmptyDocumentListProps) => {
  const dispatch = useAppDispatch();
  const [teamCreateModalOpen, setTeamCreateModalOpen] = useState(false);

  const handleCreateTeam = (teamName: string) => {
    dispatch(createTeam(teamName));
  };

  if (!currentTeam) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-semibold mb-4">Create a Team</h2>
        <p className="text-gray-500 mb-6">
          To get started, please create a team to organize your documents.
        </p>
        <Button
          onClick={() => setTeamCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + New Team
        </Button>

        <CreateTeamModal
          isOpen={teamCreateModalOpen}
          setIsOpen={setTeamCreateModalOpen}
          handleCreateTeam={handleCreateTeam}
        />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-semibold mb-4">No Documents Yet</h2>
        <p className="text-gray-500 mb-6">
          Start by creating your first document.
        </p>
        <Button
          onClick={handleCreateDocument}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + New Document
        </Button>
      </div>
    );
  }
};

export default EmptyDocumentList;
