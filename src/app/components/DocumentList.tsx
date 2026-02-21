// import type { Document } from "../types";
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
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

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

const DocumentList = ({
  documents,
  handleDocumentClick,
}: {
  documents: Document[];
  handleDocumentClick: (documentId: string, teamId: number) => void;
}) => {
  return (
    <>
      {documents.length > 0 ? (
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
                  <DropdownMenuItem>Recently edited </DropdownMenuItem>
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
      ) : (
        <div className="rounded-xl border border-[#e6ebf5] bg-white p-6 text-sm text-[#5b6b8a]">
          You have no documents yet. Create a document to get started.
        </div>
      )}
    </>
  );
};

export default DocumentList;
