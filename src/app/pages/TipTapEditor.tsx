import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, FileText } from "lucide-react";

const DocumentEditor = () => {
  const [collaborators] = useState([
    { name: "Sarah M.", avatar: "/avatars/sarah.jpg", color: "#10b981" },
    { name: "John D.", avatar: "/avatars/john.jpg", color: "#3b82f6" },
  ]);

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
    content: `
      <h1>Product Roadmap 2024</h1>
      <p>Our primary goal for 2024 is to streamline the developer experience. We are focusing on performance, reliability, and real-time collaboration tools. This document outlines our strategic pillars for the upcoming quarters.</p>
      <h2>Strategic Pillars</h2>
      <p><strong>Performance First</strong></p>
      <p>Reduce TTI (Time to Interactive) by 40% across all core modules by optimizing our rendering engine.</p>
      <p><strong>Collaborative Intelligence</strong></p>
      <p>Introduce real-time presence, multi-player editing for code blocks, and AI-assisted documentation.</p>
      <p><strong>Enterprise-Grade Security</strong></p>
      <p>SOC2 compliance auditing and advanced RBAC for workspace management.</p>
      <h2>Technical Infrastructure</h2>
      <p>To support these goals, we will migrate our core data structure to a more robust CRDT implementation:</p>
      <pre><code>schema.json

{
  "version": "2.0.0",
  "engine": "yjs-based-crdt",
  "persistence": "Postgres-LSM",
  "realtime": "WebSockets"
}</code></pre>
    `,
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none px-24 py-16",
      },
    },
  });

  const characterCount = editor?.storage.characterCount.characters() || 0;
  const wordCount = editor?.storage.characterCount.words() || 0;

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
              Product Roadmap 2024
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

      {/* Editor Content - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="relative">
          {/* Collaborator Cursor - Sarah M. */}
          <div
            className="absolute pointer-events-none z-10 transition-all duration-150"
            style={{ top: "410px", left: "870px" }}
          >
            <div className="relative">
              <div
                className="w-0.5 h-5 animate-pulse"
                style={{ backgroundColor: "#10b981" }}
              />
              <div
                className="absolute -top-6 left-0 px-2 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap shadow-lg"
                style={{ backgroundColor: "#10b981" }}
              >
                Sarah M.
              </div>
            </div>
          </div>

          <EditorContent editor={editor} />
        </div>
      </div>

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

      {/* Custom Styles */}
      <style jsx global>{`
        /* Custom editor styling */
        .ProseMirror {
          caret-color: #3b82f6;
          min-height: 100%;
        }

        .ProseMirror h1 {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 2rem;
          margin-top: 0;
          letter-spacing: -0.02em;
          color: #0f172a;
        }

        .ProseMirror h2 {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 3rem;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
          color: #1e293b;
        }

        .ProseMirror p {
          font-size: 1.0625rem;
          line-height: 1.75;
          margin-bottom: 1.25rem;
          color: #475569;
        }

        .ProseMirror strong {
          font-weight: 600;
          color: #1e293b;
        }

        .ProseMirror pre {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin: 2rem 0;
          overflow-x: auto;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .ProseMirror code {
          color: #475569;
          background: none;
          padding: 0;
          font-family: inherit;
        }

        .ProseMirror pre code {
          display: block;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }

        /* Selection styling */
        .ProseMirror ::selection {
          background: #dbeafe;
        }

        /* Check mark styling */
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
        }

        .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
        }

        /* Smooth animations */
        * {
          transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
        }
      `}</style>
    </>
  );
};

export default DocumentEditor;
