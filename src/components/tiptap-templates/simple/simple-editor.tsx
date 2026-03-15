import { useEffect, useRef, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";

interface AwarenessState {
  clientId: number;
  user: {
    id: number;
    name: string;
    color: string;
    mouseX: number;
    mouseY: number;
  };
  cursor: null;
}

// --- Toolbar Sub-components ---

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => (
  <>
    <Spacer />

    <ToolbarGroup>
      <UndoRedoButton action="undo" />
      <UndoRedoButton action="redo" />
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
      <ListDropdownMenu
        types={["bulletList", "orderedList", "taskList"]}
        portal={isMobile}
      />
      <BlockquoteButton />
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="strike" />
      <MarkButton type="underline" />
      {!isMobile ? (
        <ColorHighlightPopover />
      ) : (
        <ColorHighlightPopoverButton onClick={onHighlighterClick} />
      )}
      {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <MarkButton type="superscript" />
      <MarkButton type="subscript" />
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <TextAlignButton align="left" />
      <TextAlignButton align="center" />
      <TextAlignButton align="right" />
      <TextAlignButton align="justify" />
    </ToolbarGroup>

    <Spacer />
  </>
);

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

// --- Main Component ---

export function SimpleEditor({
  documentId,
  collabToken,
  currentUser,
  handleCollaboratorsChange,
}: {
  documentId: string;
  collabToken: string;
  currentUser: { id: number; name: string; color: string };
  handleCollaboratorsChange: (
    collaborators: Array<{ id: number; name: string; color: string }>,
  ) => void;
}) {
  const isMobile = useIsBreakpoint();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main",
  );
  const toolbarRef = useRef<HTMLDivElement>(null);

  // ydoc lives for the lifetime of the component
  const [ydoc] = useState(() => new Y.Doc());

  // provider is created once per (documentId + collabToken) pair
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

  // Stable ref so event listeners always see the latest values
  // without needing to be re-registered on every render
  const currentUserRef = useRef(currentUser);
  const providerRef = useRef<HocuspocusProvider | null>(null);
  const handleCollaboratorsChangeRef = useRef(handleCollaboratorsChange);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    handleCollaboratorsChangeRef.current = handleCollaboratorsChange;
  }, [handleCollaboratorsChange]);

  // Create / recreate the provider whenever documentId or collabToken changes
  useEffect(() => {
    const newProvider = new HocuspocusProvider({
      name: documentId,
      url: import.meta.env.VITE_COLLAB_WS_BASE_URL,
      document: ydoc,
      token: collabToken,
    });

    providerRef.current = newProvider;
    setProvider(newProvider);

    return () => {
      newProvider.off("awarenessChange");
      newProvider.destroy();
      newProvider.disconnect();
      providerRef.current = null;
    };
    // ydoc is intentionally excluded: it is stable for the component lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, collabToken]);

  // Destroy ydoc on unmount
  useEffect(() => {
    return () => {
      ydoc.destroy();
    };
  }, [ydoc]);

  // Register awareness listener and mouse-move tracker
  useEffect(() => {
    if (!provider) return;

    const onAwarenessChange = ({ states }: { states: AwarenessState[] }) => {
      const collaborators = Array.from(
        new Map(
          states.map((state) => [
            state.user.id,
            {
              id: state.user.id,
              name: state.user.name,
              color: state.user.color,
            },
          ]),
        ).values(),
      );
      // Always uses the latest callback via ref — no stale closure
      handleCollaboratorsChangeRef.current(collaborators);
    };

    provider.on("awarenessChange", onAwarenessChange);

    const onMouseMove = (event: MouseEvent) => {
      // Always uses the latest user via ref — no stale closure
      const user = currentUserRef.current;
      if (!user) return;
      providerRef.current?.setAwarenessField("user", {
        id: +user.id,
        name: user.name,
        color: user.color,
        mouseX: event.clientX,
        mouseY: event.clientY,
      });
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      provider.off("awarenessChange", onAwarenessChange);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [provider]);

  // Track whether the editor view is fully mounted.
  // useEditor returns an instance before the ProseMirror view exists, so we
  // use onCreate/onDestroy to know when it is actually safe to access view APIs.
  const [editorMounted, setEditorMounted] = useState(false);

  const editor = useEditor(
    {
      immediatelyRender: false,
      onCreate: () => setEditorMounted(true),
      onDestroy: () => setEditorMounted(false),
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          "aria-label": "Main content area, start typing to enter text.",
          class: "simple-editor",
        },
      },
      extensions: [
        StarterKit.configure({
          horizontalRule: false,
          link: {
            openOnClick: false,
            enableClickSelection: true,
          },
        }),
        Collaboration.configure({ document: ydoc }),
        // provider may be null on first render; editor is re-created when
        // provider changes (see dependency array below)
        ...(provider
          ? [
              CollaborationCaret.configure({
                provider,
                user: {
                  name: currentUser?.name,
                  color: currentUser?.color,
                },
              }),
            ]
          : []),
        HorizontalRule,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Highlight.configure({ multicolor: true }),
        Image,
        Typography,
        Superscript,
        Subscript,
        Selection,
        ImageUploadNode.configure({
          accept: "image/*",
          maxSize: MAX_FILE_SIZE,
          limit: 3,
          upload: handleImageUpload,
          onError: (error) => console.error("Upload failed:", error),
        }),
      ],
    },
    [provider],
  );

  // Only pass the editor to useCursorVisibility once onCreate has fired,
  // guaranteeing editor.view exists and view.hasFocus() won't throw.
  const rect = useCursorVisibility({
    editor: editorMounted ? editor : null,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  // Don't render until both provider and editor are ready.
  // Rendering EditorContent before the editor view is mounted causes the
  // "hasFocus" error because tiptap tries to access the view immediately.
  if (!provider || !editor) {
    return <div className="simple-editor-wrapper" />;
  }

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={
            isMobile
              ? { bottom: `calc(100% - ${height - rect.y}px)` }
              : undefined
          }
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  );
}
