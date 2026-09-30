import React from "react";
import { useEditorState } from "@tiptap/react";

// Selector dengan penanganan aman saat editor masih null
const menuBarStateSelector = (ctx) => {
  if (!ctx.editor) {
    return {
      isBold: false,
      canBold: false,
      isItalic: false,
      canItalic: false,
      isStrike: false,
      canStrike: false,
      isCode: false,
      canCode: false,
      isParagraph: false,
      isHeading1: false,
      isHeading2: false,
      isHeading3: false,
      isHeading4: false,
      isHeading5: false,
      isHeading6: false,
      isBulletList: false,
      isOrderedList: false,
      isCodeBlock: false,
      isBlockquote: false,
      canUndo: false,
      canRedo: false,
    };
  }

  return {
    isBold: ctx.editor.isActive("bold"),
    canBold: ctx.editor.can().chain().focus().toggleBold().run(),
    isItalic: ctx.editor.isActive("italic"),
    canItalic: ctx.editor.can().chain().focus().toggleItalic().run(),
    isStrike: ctx.editor.isActive("strike"),
    canStrike: ctx.editor.can().chain().focus().toggleStrike().run(),
    isCode: ctx.editor.isActive("code"),
    canCode: ctx.editor.can().chain().focus().toggleCode().run(),
    isParagraph: ctx.editor.isActive("paragraph"),
    isHeading1: ctx.editor.isActive("heading", { level: 1 }),
    isHeading2: ctx.editor.isActive("heading", { level: 2 }),
    isHeading3: ctx.editor.isActive("heading", { level: 3 }),
    isHeading4: ctx.editor.isActive("heading", { level: 4 }),
    isHeading5: ctx.editor.isActive("heading", { level: 5 }),
    isHeading6: ctx.editor.isActive("heading", { level: 6 }),
    isBulletList: ctx.editor.isActive("bulletList"),
    isOrderedList: ctx.editor.isActive("orderedList"),
    isCodeBlock: ctx.editor.isActive("codeBlock"),
    isBlockquote: ctx.editor.isActive("blockquote"),
    canUndo: ctx.editor.can().chain().focus().undo().run(),
    canRedo: ctx.editor.can().chain().focus().redo().run(),
  };
};

export const MenuBar = ({ editor }) => {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-md">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editorState.canBold}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isBold ? "bg-gray-200 font-bold" : ""
        }`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editorState.canItalic}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isItalic ? "bg-gray-200 italic" : ""
        }`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editorState.canStrike}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isStrike ? "bg-gray-200 line-through" : ""
        }`}
      >
        Strike
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editorState.canCode}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isCode ? "bg-gray-200 font-mono" : ""
        }`}
      >
        Code
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
      >
        Clear marks
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().clearNodes().run()}
        className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
      >
        Clear nodes
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isParagraph ? "bg-gray-200 font-semibold" : ""
        }`}
      >
        Paragraph
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isHeading1 ? "bg-gray-200 font-bold" : ""
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isHeading2 ? "bg-gray-200 font-bold" : ""
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isHeading3 ? "bg-gray-200 font-bold" : ""
        }`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isHeading4 ? "bg-gray-200 font-bold" : ""
        }`}
      >
        H4
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isHeading5 ? "bg-gray-200 font-bold" : ""
        }`}
      >
        H5
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isHeading6 ? "bg-gray-200 font-bold" : ""
        }`}
      >
        H6
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isBulletList ? "bg-gray-200 font-semibold" : ""
        }`}
      >
        Bullet list
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isOrderedList ? "bg-gray-200 font-semibold" : ""
        }`}
      >
        Ordered list
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isCodeBlock ? "bg-gray-200 font-semibold" : ""
        }`}
      >
        Code block
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${
          editorState.isBlockquote ? "bg-gray-200 font-semibold" : ""
        }`}
      >
        Blockquote
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
      >
        Horizontal rule
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
      >
        Hard break
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
        className="px-2 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
        className="px-2 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
      >
        Redo
      </button>
    </div>
  );
};
