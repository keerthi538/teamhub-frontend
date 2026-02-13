import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import type { TeamMember } from "../types";
import DocumentList from "../components/DocumentList";
import {
  Star,
  Bell,
  Search,
  ChevronDown,
  Settings,
  Users,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getNameInitials } from "@/lib/utils";
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

interface DocumentIconProps {
  type?: DocumentIconType;
}

interface AuthorAvatarProps {
  initials: string;
  color?: string;
}

interface StatusBadgeProps {
  status: DocumentStatus;
}

const DocumentIcon: React.FC<DocumentIconProps> = ({ type = "default" }) => {
  const iconStyles: Record<DocumentIconType, string> = {
    default: "bg-blue-100 text-blue-600",
    presentation: "bg-orange-100 text-orange-600",
    guide: "bg-gray-100 text-gray-600",
    database: "bg-teal-100 text-teal-600",
  };

  return (
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconStyles[type]}`}
    >
      <FileText className="w-5 h-5" />
    </div>
  );
};

const AuthorAvatar: React.FC<AuthorAvatarProps> = ({
  initials,
  color = "bg-purple-500",
}) => (
  <div
    className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-semibold`}
  >
    {initials}
  </div>
);

// Reusable Status Badge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<DocumentStatus, string> = {
    PUBLISHED: "bg-green-100 text-green-700 border-green-200",
    DRAFT: "bg-blue-100 text-blue-700 border-blue-200",
    INTERNAL: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <Badge variant="outline" className={`${statusStyles[status]} font-medium`}>
      {status}
    </Badge>
  );
};

export default function Dashboard() {
  const user = useAppSelector((state) => state.user);
  const { currentTeam } = user;
  const navigate = useNavigate();
  const tabs = ["All Docs", "Drafts", "Published"];

  const [documents, setDocuments] = useState<Document[]>([]);
  console.log("Documents state:", documents);
  const [activeTab, setActiveTab] = useState<string>("All Docs");

  const createDocument = () => {
    apiClient
      .post(
        "/documents/create",
        {
          teamId: currentTeam?.id,
        },
        { withCredentials: true },
      )
      .then((response) => {
        console.log("Document created:", response.data);
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
              onClick={createDocument}
              className="bg-blue-600 hover:bg-blue-700"
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
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-600">
                  Sort by: Recently edited
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Recently edited</DropdownMenuItem>
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                <DropdownMenuItem>Date created</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-gray-500 font-medium">
                DOCUMENT NAME
              </TableHead>
              <TableHead className="text-gray-500 font-medium">
                AUTHOR
              </TableHead>
              <TableHead className="text-gray-500 font-medium">
                LAST EDITED
              </TableHead>
              <TableHead className="text-gray-500 font-medium">
                STATUS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow
                key={doc.id}
                className="border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleDocumentClick(doc.uuid, doc.teamId)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <DocumentIcon type={doc.iconType} />
                    <span className="font-medium text-gray-900">
                      {doc.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AuthorAvatar
                      initials={getNameInitials(doc.author.name)}
                      color={doc.author.color ?? "bg-gray-400"}
                    />
                    <span className="text-gray-700">{doc.author.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {doc.lastEdited}
                </TableCell>
                <TableCell>
                  <StatusBadge status={doc.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">5</span> of{" "}
            <span className="font-medium">128</span> documents
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-gray-400"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 hover:bg-gray-50"
            >
              Next Page
            </Button>
          </div>
        </div>
      </div>
    </>
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
