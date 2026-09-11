import React from "react";

const UnderlinePlugin = (props) => {
  const { editor } = props;
  const handleClick = () => {
    const selection = editor.getSelection();

    const openTag = "<ins>";
    const closeTag = "</ins>";

    // Jika tidak ada seleksi, beri placeholder agar bisa edit
    const content = selection.text || "";
    const wrapped = `${openTag}${content}${closeTag}`;

    editor.insertText(
      wrapped,
      true, // ganti teks yang terseleksi
      {
        start: wrapped.length - closeTag.length, // posisi awal kursor
        end: wrapped.length - closeTag.length, // posisi akhir kursor (jika tidak blok, samakan dengan start)
      }
    );
  };

  return (
    <span
      className="button button-underline"
      title="Underline"
      onClick={handleClick}
    >
      <i className="rmel-iconfont rmel-icon-underline"></i>
    </span>
  );
};

UnderlinePlugin.pluginName = "underline_custom";
UnderlinePlugin.align = "left";

export default UnderlinePlugin;