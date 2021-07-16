import { useState } from "react";
import { GrFormView, GrFormViewHide } from "react-icons/gr";

//Markdown Imports
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export default function Markdown({
  hidden,
  markdownOnChange,
  markdown,
  rawHtml = false,
  dark = false,
}: iProps) {
  const [isEditing, setIsEditing] = useState(true);

  return (
    <div>
      {!hidden && (
        <button
          className={
            "inline-block btn" + isEditing ? "bg-primary-400" : "outline-black"
          }
          onClick={() => setIsEditing(!isEditing)}
        >
          {!isEditing ? (
            <GrFormView></GrFormView>
          ) : (
            <GrFormViewHide></GrFormViewHide>
          )}
        </button>
      )}
      <div>
        {!hidden && isEditing && markdownOnChange && (
          <textarea
            draggable="false"
            className="w-full    min-w-max outline-black resize-none h-96 "
            onChange={(e) => {
              markdownOnChange(e.target.value);
            }}
            value={markdown}
          ></textarea>
        )}
        {(!isEditing || hidden) && (
          <div className="pl-3 ">
            <ReactMarkdown
              className={`prose-sm overflow-hidden   prose-green md-content mb-10 leading-tight ${
                dark ? "prose-dark" : "prose"
              }`}
              rehypePlugins={rawHtml ? [require("rehype-raw")] : []}
              remarkPlugins={[gfm]}
              children={markdown}
            ></ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

interface iProps {
  hidden: boolean;
  markdownOnChange?: (md: string) => void;
  markdown: string;
  dark?: boolean;
  rawHtml?: boolean;
}
