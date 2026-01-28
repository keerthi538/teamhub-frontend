import type { Document } from "../types";

const DocumentList = ({
  documents,
  handleDocumentClick,
}: {
  documents: Document[];
  handleDocumentClick: (documentId: number, teamId: number) => void;
}) => {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold text-[#0b1220]">
        Your documents
      </h2>

      {documents.length > 0 ? (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="rounded-xl border border-[#e6ebf5] bg-white p-3 shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => handleDocumentClick(doc.id, doc.teamId)}
            >
              <h3 className="text-md font-semibold text-[#0b1220]">
                {doc.title}
                {doc.authorName && (
                  <span className="ml-2 text-sm font-normal text-[#5b6b8a]">
                    by {doc.authorName}
                  </span>
                )}
              </h3>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-[#e6ebf5] bg-white p-6 text-sm text-[#5b6b8a]">
          You have no documents yet. Create or upload a document to get started.
        </div>
      )}
    </>
  );
};

export default DocumentList;
