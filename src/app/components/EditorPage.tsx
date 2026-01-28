import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function EditorPage() {
  const location = useLocation();
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("Untitled document");
  const [content, setContent] = useState("");
  const [isDirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    axios
      .put(
        `http://localhost:3000/documents/${documentId}`,
        {
          title,
          content,
        },
        { withCredentials: true },
      )
      .then(() => {
        setDirty(false);
      })
      .catch((error) => {
        console.error("Error saving document:", error);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    if (location.state?.title) {
      setTitle(location.state.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchDocument = async () => {
      axios
        .get(`http://localhost:3000/documents/${documentId}`, {
          withCredentials: true,
        })
        .then((response) => {
          const doc = response.data;

          setTitle(doc.title);
          setContent(doc.content);
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
    <div className="min-h-screen bg-[#F6F9FC]">
      {/* Document header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            placeholder="Untitled document"
            className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-400 focus:outline-none"
          />

          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="ml-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : isDirty ? "Save" : "Saved"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="mx-auto max-w-4xl px-6 py-10">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setDirty(true);
          }}
          placeholder="Start writing…"
          className="min-h-[60vh] w-full resize-none rounded-xl border border-gray-200 bg-white p-5 text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>
  );
}
