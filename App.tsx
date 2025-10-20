import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeInput } from './components/CodeInput';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { Loader } from './components/Loader';
import { reviewCode } from './services/geminiService';
import { Tabs } from './components/Tabs';
import { ProjectContextInput } from './components/ProjectContextInput';
import { FileUploader } from './components/FileUploader';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [projectContext, setProjectContext] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState('paste');
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        // @ts-ignore
        const path = file.webkitRelativePath || file.name;
        resolve(`--- START OF FILE ${path} ---\n${text}\n--- END OF FILE ${path} ---\n`);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleReview = useCallback(async () => {
    setError(null);
    let codeToReview = '';

    if (activeTab === 'paste') {
      if (!code.trim()) {
        setError('Please paste some code to review.');
        return;
      }
      codeToReview = `--- START OF FILE main.js ---\n${code}\n--- END OF FILE main.js ---`;
    } else if (activeTab === 'upload') {
      if (files.length === 0) {
        setError('Please upload files or a folder to review. Note that only relevant source code files will be included.');
        return;
      }
      setIsLoading(true);
      setFeedback('');

      try {
        const fileContents = await Promise.all(files.map(readFileContent));
        codeToReview = fileContents.join('\n');
      } catch (err) {
        setError('Error reading files. Please try again.');
        setIsLoading(false);
        return;
      }
    }

    if (!codeToReview) return;

    setIsLoading(true);
    setFeedback('');

    try {
      const result = await reviewCode(codeToReview, projectContext);
      setFeedback(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [code, files, activeTab, projectContext]);

  const TABS = [
    { id: 'paste', label: 'Paste Code' },
    { id: 'upload', label: 'Upload Folder' },
    { id: 'git', label: 'Git Repository', disabled: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-slate-900 via-base-200 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        <main className="mt-8 space-y-8">
          
          <div className="bg-base-200/50 p-6 rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">
              1. Provide Project Context <span className="text-sm text-slate-400">(Optional, but recommended)</span>
            </h2>
            <ProjectContextInput value={projectContext} onChange={(e) => setProjectContext(e.target.value)} />
          </div>

          <div className="bg-base-200/50 p-6 rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">
              2. Provide Your Code
            </h2>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={TABS} />
            <div className="pt-4">
                {activeTab === 'paste' && <CodeInput value={code} onChange={(e) => setCode(e.target.value)} />}
                {activeTab === 'upload' && <FileUploader onFilesSelected={setFiles} />}
                {activeTab === 'git' && (
                    <div className="mt-4 p-8 text-center bg-base-100 rounded-lg border border-slate-700">
                        <p className="text-slate-400">Git repository integration is coming soon!</p>
                        <p className="text-sm text-slate-500">This feature will allow you to directly connect private repositories for a seamless review experience.</p>
                    </div>
                )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-400">
              AI-powered feedback for aspiring developers & architects.
            </p>
            <button
              onClick={handleReview}
              disabled={isLoading}
              className="relative inline-flex items-center justify-center px-6 py-2 bg-brand-accent text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
            >
              {isLoading && <Loader />}
              <span className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Review Code
              </span>
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg shadow-lg">
              <p><span className="font-bold">Error:</span> {error}</p>
            </div>
          )}

          {!isLoading && !feedback && !error && (
             <div className="mt-6 text-center text-slate-500 py-10">
                <p>Your code review will appear here.</p>
             </div>
          )}

          {feedback && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-100 mb-4">Review Feedback</h2>
              <FeedbackDisplay feedback={feedback} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;