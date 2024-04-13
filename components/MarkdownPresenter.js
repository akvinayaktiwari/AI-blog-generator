import React from 'react';
import ReactMarkdown from 'react-markdown';

function MarkdownPresenter({ markdownText }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{markdownText}</ReactMarkdown>
    </div>
  );
}

export default MarkdownPresenter;
