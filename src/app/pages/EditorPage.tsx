import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, type Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, FileText } from "lucide-react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditorPage = () => {
  const [collaborators] = useState([
    { name: "Sarah M.", avatar: "/avatars/sarah.jpg", color: "#10b981" },
    { name: "John D.", avatar: "/avatars/john.jpg", color: "#3b82f6" },
  ]);
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("Untitled document");
  // const [content, setContent] = useState("");
  const [editorContent, setEditorContent] = useState<Content>({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Start writing..." }],
      },
    ],
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      CharacterCount,
    ],
    // content={editorContent}
    // onChange={setEditorContent}
    //     content: `
    //       <h1>Product Roadmap 2024</h1>
    //       <p>Our primary goal for 2024 is to streamline the developer experience. We are focusing on performance, reliability, and real-time collaboration tools. This document outlines our strategic pillars for the upcoming quarters.</p>
    //       <h2>Strategic Pillars</h2>
    //       <p><strong>Performance First</strong></p>
    //       <p>Reduce TTI (Time to Interactive) by 40% across all core modules by optimizing our rendering engine.</p>
    //       <p><strong>Collaborative Intelligence</strong></p>
    //       <p>Introduce real-time presence, multi-player editing for code blocks, and AI-assisted documentation.</p>
    //       <p><strong>Enterprise-Grade Security</strong></p>
    //       <p>SOC2 compliance auditing and advanced RBAC for workspace management.</p>
    //       <h2>Technical Infrastructure</h2>
    //       <p>To support these goals, we will migrate our core data structure to a more robust CRDT implementation:</p>
    //       <pre><code>schema.json

    // {
    //   "version": "2.0.0",
    //   "engine": "yjs-based-crdt",
    //   "persistence": "Postgres-LSM",
    //   "realtime": "WebSockets"
    // }</code></pre>
    //     `,
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none px-24 py-16",
      },
    },
  });

  const characterCount = editor?.storage.characterCount.characters() || 0;
  const wordCount = editor?.storage.characterCount.words() || 0;

  useEffect(() => {
    const fetchDocument = async () => {
      axios
        .get(`http://localhost:3000/documents/${documentId}`, {
          withCredentials: true,
        })
        .then((response) => {
          const doc = response.data;

          setTitle(doc.title);
          // setContent(doc.content);
        })
        .catch((error) => {
          console.error("Error fetching document:", error);
          navigate("/");
        });
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

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
            <h1 className="text-base font-semibold text-slate-900 tracking-tight">
              {title}
            </h1>
          </div>

          {/* Right: Collaborators & Share */}
          <div className="flex items-center gap-4">
            {/* Collaborators */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {collaborators.map((collab, idx) => (
                  <Avatar
                    key={idx}
                    className="w-8 h-8 border-2 border-white ring-2 ring-slate-100 transition-transform hover:scale-110 hover:z-10"
                  >
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                      {collab.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white ring-2 ring-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 transition-transform hover:scale-110 hover:z-10">
                  +2
                </div>
              </div>
            </div>

            {/* Share Button */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 font-medium">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            {/* User Avatar */}
            <Avatar className="w-9 h-9 border-2 border-slate-200 shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-medium">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <SimpleEditor content={editorContent} onChange={setEditorContent} />

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
            <span className="font-medium text-emerald-600">CLOUD SYNCED</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default EditorPage;
