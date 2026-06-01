"use client";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, FontFamily, FontSize } from "@tiptap/extension-text-style";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo2,
  Redo2,
  Eraser
} from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";

const FONT_FAMILIES: { label: string; value: string }[] = [
  { label: "Default", value: "" },
  { label: "Sans", value: "ui-sans-serif, system-ui, sans-serif" },
  { label: "Serif", value: "ui-serif, Georgia, serif" },
  { label: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, monospace" }
];

const FONT_SIZES: { label: string; value: string }[] = [
  { label: "Tamaño", value: "" },
  { label: "12 px", value: "12px" },
  { label: "14 px", value: "14px" },
  { label: "16 px", value: "16px" },
  { label: "18 px", value: "18px" },
  { label: "20 px", value: "20px" },
  { label: "24 px", value: "24px" },
  { label: "32 px", value: "32px" }
];

interface Props {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

interface ToolbarBtnProps {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}

function ToolbarBtn({ active, disabled, onClick, ariaLabel, children }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={clsx(
        "h-8 w-8 inline-flex items-center justify-center rounded-input transition-colors",
        "hover:bg-base-light dark:hover:bg-base-dark",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        active && "bg-brand/10 text-brand"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-line-light dark:bg-line-dark" aria-hidden />;
}

function Toolbar({ editor }: { editor: Editor }) {
  const currentFont =
    (editor.getAttributes("textStyle").fontFamily as string | undefined) ?? "";
  const currentSize =
    (editor.getAttributes("textStyle").fontSize as string | undefined) ?? "";

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-line-light dark:border-line-dark px-2 py-1.5">
      <ToolbarBtn
        ariaLabel="Negrita"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        ariaLabel="Cursiva"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        ariaLabel="Subrayado"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        ariaLabel="Tachado"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarBtn>

      <Divider />

      <ToolbarBtn
        ariaLabel="Encabezado 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        ariaLabel="Encabezado 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        ariaLabel="Encabezado 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarBtn>

      <Divider />

      <ToolbarBtn
        ariaLabel="Lista con viñetas"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        ariaLabel="Lista numerada"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        ariaLabel="Cita"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarBtn>

      <Divider />

      <select
        aria-label="Fuente"
        value={currentFont}
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          const v = e.target.value;
          if (v) editor.chain().focus().setFontFamily(v).run();
          else editor.chain().focus().unsetFontFamily().run();
        }}
        className="h-8 text-xs rounded-input border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark px-2"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value}>{f.label}</option>
        ))}
      </select>

      <select
        aria-label="Tamaño de fuente"
        value={currentSize}
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          const v = e.target.value;
          if (v) editor.chain().focus().setFontSize(v).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
        className="h-8 text-xs rounded-input border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark px-2"
      >
        {FONT_SIZES.map((f) => (
          <option key={f.label} value={f.value}>{f.label}</option>
        ))}
      </select>

      <Divider />

      <ToolbarBtn
        ariaLabel="Limpiar formato"
        onClick={() =>
          editor
            .chain()
            .focus()
            .unsetAllMarks()
            .clearNodes()
            .unsetFontFamily()
            .unsetFontSize()
            .run()
        }
      >
        <Eraser className="h-4 w-4" />
      </ToolbarBtn>

      <div className="flex-1" />

      <ToolbarBtn
        ariaLabel="Deshacer"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn
        ariaLabel="Rehacer"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-4 w-4" />
      </ToolbarBtn>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  onBlur,
  placeholder = "Escribe la sinopsis...",
  maxLength,
  className
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      TextStyle,
      FontFamily,
      FontSize
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: clsx(
          "tiptap-content min-h-[160px] max-h-[480px] overflow-y-auto px-3 py-2 outline-none",
          "prose prose-sm dark:prose-invert max-w-none"
        )
      }
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? "" : editor.getHTML();
      onChange(html);
    },
    onBlur: () => {
      onBlur?.();
    }
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current && (value || "<p></p>") !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rounded-input border border-line-light dark:border-line-dark min-h-[200px] animate-pulse bg-base-light dark:bg-base-dark" />
    );
  }

  const textLength = editor.getText().length;

  return (
    <div
      className={clsx(
        "rounded-input border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark overflow-hidden",
        "focus-within:ring-1 focus-within:ring-brand focus-within:border-brand transition",
        className
      )}
      data-placeholder={placeholder}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      {typeof maxLength === "number" && (
        <div className="px-3 py-1.5 text-xs opacity-50 border-t border-line-light dark:border-line-dark flex justify-end">
          <span className={textLength > maxLength ? "text-brand" : ""}>
            {textLength}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}
