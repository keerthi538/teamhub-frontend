import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Check, Loader2, Upload } from "lucide-react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useNavigate, useParams } from "react-router-dom";
import { debounce, getNameInitials } from "@/lib/utils";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/userSlice";
import apiClient from "@/lib/axios";

const MAX_COLLABORATORS_DISPLAYED = 4;

const EditorPage = () => {
  const [collaborators, setCollaborators] = useState<
    Array<{ name: string; color: string }>
  >([]);
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("Untitled document");
  const [isLoading, setIsLoading] = useState(true);
  const [collabToken, setCollabToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [titleSaved, setTitleSaved] = useState(false);
  const [isDocPublished, setIsDocPublished] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const user = useAppSelector(selectUser);

  const characterCount = 250;
  const wordCount = 70;

  const visibleCollaborators = collaborators.slice(
    0,
    MAX_COLLABORATORS_DISPLAYED,
  );
  const extraCollaboratorsCount =
    collaborators.length - MAX_COLLABORATORS_DISPLAYED;

  const extraCollaboratorsNames = collaborators
    .slice(MAX_COLLABORATORS_DISPLAYED)
    .map((collab) => collab.name)
    .join(", ");

  useEffect(() => {
    const fetchDocumentAndToken = async () => {
      if (!documentId) {
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);

        // Fetch document metadata and collaboration token in parallel
        const [docResponse, tokenResponse] = await Promise.all([
          apiClient.get(`/documents/${documentId}`, {
            withCredentials: true,
          }),
          apiClient.get(`/documents/${documentId}/token`, {
            withCredentials: true,
          }),
        ]);

        const doc = docResponse.data;
        const { token, user } = tokenResponse.data;

        setIsDocPublished(doc.published);
        setTitle(doc.title);
        setCollabToken(token);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading document:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentAndToken();
  }, [documentId]);

  const handleDocumentPublish = async () => {
    try {
      await apiClient.patch(
        `/documents/${documentId}/publish`,
        {},
        { withCredentials: true },
      );
      setIsDocPublished(true);
    } catch (error) {
      console.error("Error publishing document:", error);
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    try {
      setIsSavingTitle(true);
      setTitleSaved(false);

      await apiClient.patch(
        `/documents/${documentId}/title`,
        { title: newTitle?.trim() },
        { withCredentials: true },
      );

      setTitleSaved(true);

      // Hide checkmark after 2 seconds
      setTimeout(() => {
        setTitleSaved(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving title:", error);
    } finally {
      setIsSavingTitle(false);
    }
  };

  const debouncedTitleChange = useMemo(
    () => debounce(handleTitleChange, 1000),
    [],
  );

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      titleInputRef.current?.blur();
    }
  };

  if (isLoading || !collabToken || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between px-8 py-3">
          {/* Left: Document Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-slate-700">Engineering</span>
            </div>
            <div className="w-px h-5 bg-slate-300" />

            <div className="flex items-center gap-2">
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  debouncedTitleChange(event.target.value);
                }}
                onKeyDown={handleTitleKeyDown}
                placeholder="Untitled document"
                className="text-base font-semibold text-slate-900 tracking-tight bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 -ml-2 min-w-[200px] max-w-[400px]"
              />

              {/* Save Indicator */}
              {isSavingTitle && (
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              )}
              {titleSaved && <Check className="w-4 h-4 text-emerald-500" />}
            </div>
          </div>

          {/* Right: Collaborators & Share */}
          <div className="flex items-center gap-4">
            {/* Collaborators */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {visibleCollaborators.map((collab, idx) => (
                  <Avatar
                    key={idx}
                    className="w-8 h-8 border-2 border-white ring-2 ring-slate-100 transition-transform hover:scale-110 hover:z-10"
                    title={collab.name}
                  >
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                      {getNameInitials(collab.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}

                {extraCollaboratorsCount > 0 && (
                  <div
                    title={extraCollaboratorsNames}
                    className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white ring-2 ring-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 transition-transform hover:scale-110 hover:z-10"
                  >
                    +{extraCollaboratorsCount}
                  </div>
                )}
              </div>
            </div>

            {/* Publish Button */}

            <Button
              onClick={handleDocumentPublish}
              disabled={isDocPublished}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 font-medium"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isDocPublished ? "Published" : "Publish"}
            </Button>

            {/* User Avatar */}
            <Avatar className="w-9 h-9 border-2 border-slate-200 shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-medium">
                {getNameInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <SimpleEditor
        documentId={documentId!}
        collabToken={collabToken}
        currentUser={currentUser}
        handleCollaboratorsChange={setCollaborators}
      />

      {/* Footer Stats */}
      <footer className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/60">
        <div className="flex items-center justify-between px-8 py-2.5">
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="font-medium">
              CHARACTERS:{" "}
              <span className="text-slate-700">
                {characterCount.toLocaleString()}
              </span>
            </span>
            <span className="font-medium">
              WORDS: <span className="text-slate-700">{wordCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-emerald-600">CLOUD SYNCED </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default EditorPage;
