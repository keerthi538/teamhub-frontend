import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Document, TeamMember } from "../types";
import DocumentList from "../components/DocumentList";
import { AddTeamMemberDialog } from "../components/AddteamMemberModal";

export default function Dashboard() {
  const user = useAppSelector((state) => state.user);
  const { currentTeam } = user;
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const createDocument = () => {
    axios
      .post(
        "http://localhost:3000/documents/create",
        {
          teamId: currentTeam?.id,
        },
        { withCredentials: true },
      )
      .then((response) => {
        console.log("Document created:", response.data);
        const newDocId = response.data.id;
        navigate(`/teams/${currentTeam?.id}/documents/${newDocId}`, {
          state: { title: response.data.title },
        });
      })
      .catch((error) => {
        console.error("Error creating document:", error);
      });
  };

  const handleTeamMemberAdd = (email: string) => {
    axios
      .post(
        "http://localhost:3000/teams/members/add",
        {
          email,
        },
        { withCredentials: true },
      )
      .then((response) => {
        console.log("Team member added:", response.data);
        setTeamMembers((prevMembers) => [...prevMembers, response.data]);
      })
      .catch((error) => {
        console.error("Error adding team member:", error);
      });
  };

  const handleDocumentClick = (documentId: number, teamId: number) => {
    navigate(`/teams/${teamId}/documents/${documentId}`);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/documents", { withCredentials: true })
      .then((response) => {
        console.log("Fetched documents:", response.data);

        setDocuments(
          response.data?.map((doc: any) => ({
            id: doc.id,
            title: doc.title,
            teamId: doc.teamId,
            authorName: doc.author.name,
          })),
        );
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });

    axios
      .get("http://localhost:3000/teams/members", { withCredentials: true })
      .then((response) => {
        setTeamMembers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching team members:", error);
      });
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {currentTeam ? (
        <>
          <section className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button
              className="rounded-xl border border-dashed border-[#e6ebf5] bg-white p-6 text-sm text-[#4f7cff] hover:bg-[#f6f8ff] cursor-pointer"
              onClick={createDocument}
            >
              + New document
            </button>
            <ActionCard
              title="Upload documents"
              description="Add new files to your workspace"
            />
          </section>

          {/* Team members badges */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-[#0b1220]">
              Team members
            </h2>

            <div className="flex space-x-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-full bg-[#e6ebf5] px-4 py-2 text-sm text-[#0b1220]"
                >
                  {member.name}
                </div>
              ))}

              <AddTeamMemberDialog onAdd={handleTeamMemberAdd} />
            </div>
          </section>

          <section className="mb-10">
            <DocumentList
              documents={documents}
              handleDocumentClick={handleDocumentClick}
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[#0b1220]">
              Recent activity
            </h2>
            <div className="rounded-xl border border-[#e6ebf5] bg-white p-6 text-sm text-[#5b6b8a]">
              No activity yet. Upload your first document to get started.
            </div>
          </section>
        </>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}

function ActionCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[#e6ebf5] bg-white p-6 shadow-sm transition hover:shadow-md">
      <h3 className="mb-1 text-sm font-semibold text-[#0b1220]">{title}</h3>
      <p className="text-sm text-[#5b6b8a]">{description}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e6ebf5] bg-white py-20 text-center">
      <h2 className="mb-2 text-xl font-semibold text-[#0b1220]">
        You’re not part of any team yet
      </h2>
      <p className="mb-6 max-w-sm text-sm text-[#5b6b8a]">
        Create a team to start sharing documents and collaborating with others.
      </p>
      <button className="rounded-lg bg-[#4f7cff] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3f6cf3]">
        Create your first team
      </button>
    </div>
  );
}
