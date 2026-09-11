"use client";
import dynamic from "next/dynamic";
import RenderMd from "./md";
import { plugins } from "./plugins";
import "react-markdown-editor-lite/lib/index.css";

const MdEditor = dynamic(
  () => {
    return new Promise((resolve) => {
      Promise.all([
        import("react-markdown-editor-lite"),
        import("./undeLinePlugins"),
      ]).then((res) => {
        res[0].default.use(res[1].default);
        resolve(res[0].default);
      });
    });
  },
  {
    ssr: false,
  },
);

function Markdown({ value, handleEditorChange, name }) {
  return (
    <div>
      <MdEditor
        config={{
          view: {
            menu: true,
            md: true,
            html: false,
            fullScreen: false,
            hideMenu: true,
          },
          table: {
            maxRow: 5,
            maxCol: 6,
          },
          syncScrollMode: ["leftFollowRight", "rightFollowLeft"],
        }}
        plugins={plugins}
        imageAccept=".jpg,.png"
        name={name}
        value={value}
        style={{ height: "200px" }}
        renderHTML={(text) => <RenderMd markdown={text} />}
        onChange={handleEditorChange}
      />
    </div>
  );
}
export default Markdown;
