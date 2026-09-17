"use client";

import TiptapImage from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions/placeholder";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { editorContentFromStored } from "@/lib/blog-html";
import { uploadContentImage } from "@/lib/storage-client";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  labelledBy?: string;
};

const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      HTMLAttributes: {
        rel: "noopener noreferrer nofollow",
      },
    },
  }),
  Placeholder.configure({
    placeholder: "Write the article…",
  }),
  TiptapImage.configure({
    inline: false,
    allowBase64: false,
  }),
];

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function imageFilesFromList(files: FileList | null | undefined): File[] {
  if (!files?.length) return [];
  return Array.from(files).filter((file) => file.type.startsWith("image/"));
}

function altFromFileName(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
}

function normalizeHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("mailto:")) return trimmed;
  try {
    const url = new URL(
      trimmed.includes("://") ? trimmed : `https://${trimmed}`,
    );
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function applyLink(editor: Editor, rawHref: string): boolean {
  const href = normalizeHref(rawHref);
  if (!href) return false;
  if (editor.state.selection.empty) {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "text",
        text: href,
        marks: [{ type: "link", attrs: { href } }],
      })
      .run();
  } else {
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }
  return true;
}

export function RichTextEditor({
  value,
  onChange,
  disabled = false,
  labelledBy,
}: RichTextEditorProps) {
  const lastEmitted = useRef(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorHolder = useRef<Editor | null>(null);
  const uploadingRef = useRef(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkHref, setLinkHref] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const insertImageFiles = useCallback(async (files: File[]) => {
    const current = editorHolder.current;
    if (!current || files.length === 0 || uploadingRef.current) {
      return;
    }

    uploadingRef.current = true;
    setUploading(true);
    setImageError("");

    try {
      for (const file of files) {
        const src = await uploadContentImage(file, "blogs");
        current.chain().focus().setImage({
          src,
          alt: altFromFileName(file.name),
        }).run();
      }
    } catch (error) {
      setImageError(
        error instanceof Error ? error.message : "Unable to upload image.",
      );
    } finally {
      uploadingRef.current = false;
      setUploading(false);
    }
  }, []);

  const insertImageFilesRef = useRef(insertImageFiles);
  insertImageFilesRef.current = insertImageFiles;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: editorContentFromStored(value),
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "tiptap blog-prose min-h-72 px-4 py-3 focus:outline-none",
        ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
      },
      handlePaste(_view, event) {
        const files = imageFilesFromList(event.clipboardData?.files);
        if (files.length === 0) return false;
        event.preventDefault();
        void insertImageFilesRef.current(files);
        return true;
      },
      handleDrop(_view, event) {
        const files = imageFilesFromList(event.dataTransfer?.files);
        if (files.length === 0) return false;
        event.preventDefault();
        void insertImageFilesRef.current(files);
        return true;
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
  });

  useEffect(() => {
    editorHolder.current = editor;
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    if (value === lastEmitted.current) return;
    const next = editorContentFromStored(value);
    editor.commands.setContent(next, { emitUpdate: false });
    lastEmitted.current = value;
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-72 border border-outline-variant bg-surface-container-lowest px-4 py-3 font-sans text-body-md text-on-surface-variant">
        Loading editor…
      </div>
    );
  }

  return (
    <div
      className={`rich-text-editor border border-outline-variant bg-surface-container-lowest focus-within:border-primary ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => {
          const files = imageFilesFromList(event.target.files);
          event.target.value = "";
          void insertImageFiles(files);
        }}
      />
      <EditorToolbar
        editor={editor}
        linkOpen={linkOpen}
        uploading={uploading}
        onInsertImage={() => fileInputRef.current?.click()}
        onToggleLink={() => {
          const current = String(editor.getAttributes("link").href || "");
          setLinkHref(current);
          setLinkOpen((open) => !open);
        }}
      />
      {uploading ? (
        <p className="border-b border-outline-variant px-3 py-2 font-sans text-sm text-on-surface-variant">
          Uploading image…
        </p>
      ) : null}
      {imageError ? (
        <p
          className="border-b border-outline-variant px-3 py-2 font-sans text-sm text-error"
          role="alert"
        >
          {imageError}
        </p>
      ) : null}
      {linkOpen ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant px-3 py-2">
          <input
            value={linkHref}
            onChange={(event) => setLinkHref(event.target.value)}
            placeholder="https://"
            className="min-w-48 flex-1 border border-outline-variant bg-pure-white px-3 py-2 font-sans text-body-md text-on-surface focus:border-primary focus:outline-none"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (applyLink(editor, linkHref)) {
                  setLinkOpen(false);
                }
              }
              if (event.key === "Escape") {
                setLinkOpen(false);
              }
            }}
          />
          <button
            type="button"
            className="border border-primary bg-primary px-3 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary"
            onClick={() => {
              if (applyLink(editor, linkHref)) {
                setLinkOpen(false);
              }
            }}
          >
            Apply
          </button>
          <button
            type="button"
            className="border border-outline-variant px-3 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant"
            onClick={() => {
              editor.chain().focus().unsetLink().run();
              setLinkHref("");
              setLinkOpen(false);
            }}
          >
            Remove
          </button>
        </div>
      ) : null}
      <EditorContent editor={editor} />
    </div>
  );
}

type EditorToolbarProps = {
  editor: Editor;
  linkOpen: boolean;
  uploading: boolean;
  onInsertImage: () => void;
  onToggleLink: () => void;
};

function EditorToolbar({
  editor,
  linkOpen,
  uploading,
  onInsertImage,
  onToggleLink,
}: EditorToolbarProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      strike: current.isActive("strike"),
      code: current.isActive("code"),
      h2: current.isActive("heading", { level: 2 }),
      h3: current.isActive("heading", { level: 3 }),
      bullet: current.isActive("bulletList"),
      ordered: current.isActive("orderedList"),
      quote: current.isActive("blockquote"),
      link: current.isActive("link"),
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });

  return (
    <div
      className="flex flex-wrap items-center gap-1 border-b border-outline-variant bg-pure-white p-2"
      role="toolbar"
      aria-label="Text formatting"
    >
      <ToolbarButton
        label="Undo"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <UndoIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <RedoIcon />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        label="Heading 2"
        active={state.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={state.h3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        label="Bold"
        active={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={state.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        active={state.code}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {"</>"}
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        label="Bullet list"
        active={state.bullet}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <BulletListIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={state.ordered}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <OrderedListIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={state.quote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <QuoteIcon />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        label="Link"
        active={state.link || linkOpen}
        onClick={onToggleLink}
      >
        <LinkIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Insert image"
        disabled={uploading}
        onClick={onInsertImage}
      >
        <ImageIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <HrIcon />
      </ToolbarButton>
    </div>
  );
}

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      title={label}
      onClick={onClick}
      className={`inline-flex h-8 min-w-8 items-center justify-center px-2 font-sans text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-primary text-on-primary"
          : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <span
      className="mx-1 h-5 w-px bg-outline-variant"
      aria-hidden="true"
    />
  );
}

function UndoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 7L4 11l4 4M4 11h10a6 6 0 010 12H8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 7l4 4-4 4M20 11H10a6 6 0 000 12h6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

function BulletListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6h12M9 12h12M9 18h12" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="5" cy="6" r="1.25" fill="currentColor" />
      <circle cx="5" cy="12" r="1.25" fill="currentColor" />
      <circle cx="5" cy="18" r="1.25" fill="currentColor" />
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 6h11M10 12h11M10 18h11" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4 5.5h2v4H4M4.2 15.5h2.3M5.3 15.5V19M4 19h2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 11h4v6H6v-5c0-3 2-5 5-6M15 11h4v6h-5v-5c0-3 2-5 5-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 00-7.07-7.07L10 5.93M14 11a5 5 0 00-7.07 0L5.52 12.41a5 5 0 007.07 7.07L14 18.07"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5h16v14H4V5zM4 16l5-5 4 4 2-2 5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
      <circle cx="9" cy="9" r="1.25" fill="currentColor" />
    </svg>
  );
}

function HrIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16M7 8h10M7 16h10" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
