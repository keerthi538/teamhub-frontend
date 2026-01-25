import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function EditorPage() {
  const location = useLocation();

  const [title, setTitle] = useState("Untitled document");

  useEffect(() => {
    if (location.state?.title) {
      setTitle(location.state.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      {/* Document header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <input
            type="text"
            value={title}
            placeholder="Untitled document"
            className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-400 focus:outline-none"
          />

          {/* Save status placeholder */}
          <p className="mt-1 text-sm text-gray-400">Saved just now</p>
        </div>
      </div>

      {/* Editor */}
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div
          contentEditable
          suppressContentEditableWarning
          className="
            min-h-[60vh]
            rounded-xl
            bg-white
            px-6 py-5
            text-gray-800
            leading-relaxed
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-blue-200
          "
        >
          <p className="text-gray-400">Start writing your document…</p>
        </div>
      </div>
    </div>
  );
}
