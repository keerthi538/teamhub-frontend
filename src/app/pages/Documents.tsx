import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import DocumentList from "../components/DocumentList";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import apiClient from "@/lib/axios";

// Type Definitions
type DocumentStatus = "PUBLISHED" | "DRAFT" | "INTERNAL";
type DocumentIconType = "default" | "presentation" | "guide" | "database";

interface Author {
  initials: string;
  name: string;
  color: string;
}

interface Document {
  id: number;
  uuid: string;
  name: string;
  author: Author;
  lastEdited: string;
  status: DocumentStatus;
  iconType: DocumentIconType;
  teamId: number;
}

export default function Dashboard() {
  const user = useAppSelector((state) => state.user);
  const { currentTeam } = user;
  const navigate = useNavigate();
  const tabs = ["All Docs", "Drafts", "Published"];

  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All Docs");

  const handleCreateDocument = () => {
    apiClient
      .post(
        "/documents/create",
        {
          teamId: currentTeam?.id,
        },
        { withCredentials: true },
      )
      .then((response) => {
        const newDocUuid = response.data.uuid;
        navigate(`/teams/${currentTeam?.id}/documents/${newDocUuid}`, {
          state: { title: response.data.title },
        });
      })
      .catch((error) => {
        console.error("Error creating document:", error);
      });
  };

  const handleDocumentClick = (documentUuid: string, teamId: number) => {
    navigate(`/teams/${teamId}/documents/${documentUuid}`);
  };

  useEffect(() => {
    apiClient
      .get("/documents", { withCredentials: true })
      .then((response) => {
        console.log("Fetched documents:", response.data);

        setDocuments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }, [currentTeam]);

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search documents (Cmd+K)"
                className="pl-10 w-80 bg-gray-50 border-gray-200"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-white border border-gray-200 rounded">
                ⌘K
              </kbd>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              onClick={handleCreateDocument}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!currentTeam?.id}
            >
              + New Document
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-8">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <DocumentList
        documents={documents}
        handleDocumentClick={handleDocumentClick}
        currentTeam={currentTeam}
        handleCreateDocument={handleCreateDocument}
      />
    </>
  );
}
