
import React, { useMemo } from 'react';

interface FeedbackDisplayProps {
  feedback: string;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  const formattedFeedback = useMemo(() => {
    const lines = feedback.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (inList) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 mb-4">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        flushList();
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${elements.length}`} className="bg-base-100 p-4 rounded-md overflow-x-auto my-4 border border-slate-700">
              <code className="text-sm font-mono text-cyan-300">{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
        }
        inCodeBlock = !inCodeBlock;
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-semibold text-slate-100 mt-6 mb-3 pb-1 border-b border-slate-700">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        if (!inList) {
          inList = true;
        }
        listItems.push(
          <li key={index} className="text-slate-300 leading-relaxed">
            {line.substring(2)}
          </li>
        );
      } else {
        flushList();
        if (line.trim() !== '') {
          elements.push(<p key={index} className="text-slate-300 my-2 leading-relaxed">{line}</p>);
        }
      }
    });
    
    flushList(); // Make sure the last list is rendered if it exists

    // Render any remaining code block content if the feedback ends mid-block
    if (inCodeBlock && codeBlockContent.length > 0) {
        elements.push(
            <pre key={`code-final-${elements.length}`} className="bg-base-100 p-4 rounded-md overflow-x-auto my-4 border border-slate-700">
              <code className="text-sm font-mono text-cyan-300">{codeBlockContent.join('\n')}</code>
            </pre>
          );
    }

    return elements;
  }, [feedback]);

  return (
    <div className="bg-base-200/50 p-6 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
        {formattedFeedback}
    </div>
  );
};
