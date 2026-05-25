"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useId, useRef } from "react";

/**
 * Self-hosted TinyMCE rich-text editor.
 *
 * Assets live at /public/tinymce (copied from node_modules/tinymce by the
 * `copy-tinymce` npm script which runs on postinstall). Uses no cloud API
 * key — `licenseKey: "gpl"` opts into the bundled GPL-2.0 license.
 *
 * Returns HTML on change. Trusted-input: only authenticated admins can call
 * the write actions (RLS), so we render `dangerouslySetInnerHTML` downstream
 * without sanitization.
 */
export function RichTextEditor({
  value,
  onChange,
  height = 480,
}: {
  value: string;
  onChange: (html: string) => void;
  height?: number;
}) {
  const id = useId();
  const editorRef = useRef<unknown>(null);

  return (
    <Editor
      id={id}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      onInit={(_evt, editor) => {
        editorRef.current = editor;
      }}
      value={value}
      onEditorChange={(html) => onChange(html)}
      init={{
        height,
        menubar: false,
        branding: false,
        promotion: false,
        statusbar: true,
        skin: "oxide",
        content_css: "default",
        font_family_formats:
          "Sans=Manrope,system-ui,sans-serif;Serif=Alegreya,Georgia,serif;Mono=ui-monospace,monospace",
        content_style: [
          "body { font-family: Manrope, system-ui, sans-serif; font-size: 16px; line-height: 1.6; color: #1F1B17; }",
          "h1, h2, h3 { font-family: Alegreya, Georgia, serif; color: #1F1B17; line-height: 1.2; }",
          "a { color: #9C4F22; }",
          "blockquote { border-left: 3px solid #9C4F22; padding-left: 1rem; color: #6E6962; font-style: italic; }",
        ].join(""),
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "media",
          "table",
          "wordcount",
        ].join(" "),
        toolbar:
          "undo redo | blocks | bold italic underline | bullist numlist | link image | blockquote hr | removeformat code fullscreen",
        block_formats:
          "Гарчиг 2=h2; Гарчиг 3=h3; Параграф=p; Иш татлага=blockquote",
        toolbar_mode: "sliding",
        default_link_target: "_blank",
        link_default_protocol: "https",
        image_caption: true,
        image_dimensions: false,
        image_advtab: false,
        relative_urls: false,
        convert_urls: false,
      }}
    />
  );
}
