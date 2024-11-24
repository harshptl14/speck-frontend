import React from "react";
import ReactMarkdown from "react-markdown";

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <div>
      <ReactMarkdown className="prose prose-zinc prose-base max-w-none prose-p:text-muted-foreground prose-p:leading-6 prose-headings:mb-0 prose-h1:text-2xl">
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
