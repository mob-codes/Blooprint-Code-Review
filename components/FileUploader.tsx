import React, { useCallback, useState } from 'react';
import { filterProjectFiles, MAX_FILES_LIMIT } from '../utils/fileFilter';


interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);


export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [totalFileCount, setTotalFileCount] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isLimitExceeded, setIsLimitExceeded] = useState(false);

    const processFiles = useCallback((files: File[]) => {
      setTotalFileCount(files.length);
      const filtered = filterProjectFiles(files);
      
      if (filtered.length > MAX_FILES_LIMIT) {
        setIsLimitExceeded(true);
        setSelectedFiles([]);
        onFilesSelected([]);
      } else {
        setIsLimitExceeded(false);
        setSelectedFiles(filtered);
        onFilesSelected(filtered);
      }
    }, [onFilesSelected]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            processFiles(Array.from(event.target.files));
        }
    };

    const handleClear = () => {
        setSelectedFiles([]);
        setTotalFileCount(0);
        onFilesSelected([]);
        setIsLimitExceeded(false);
        // Reset the file input so the same folder can be selected again
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    }, [processFiles]);


    return (
        <div>
            {selectedFiles.length === 0 && totalFileCount === 0 ? (
                 <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                    ${isDragging ? 'border-brand-accent bg-base-200' : 'border-slate-700 hover:border-slate-600'}`}>
                    <input
                        type="file"
                        id="file-upload"
                        multiple
                        // @ts-ignore
                        webkitdirectory="true"
                        directory="true"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                            <FolderIcon />
                            <p className="mt-2 text-slate-400">
                                <span className="font-semibold text-brand-accent">Click to upload</span> or drag and drop a folder.
                            </p>
                            <p className="text-xs text-slate-500">Select the root folder of your project</p>
                        </div>
                    </label>
                </div>
            ) : (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-md font-semibold text-slate-300">Selected Project:</h3>
                        <button onClick={handleClear} className="text-sm text-red-400 hover:text-red-300">
                            Clear
                        </button>
                    </div>

                    {isLimitExceeded ? (
                         <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                            <p className="font-bold">Too many files!</p>
                            <p className="text-sm">Please select a project with fewer than {MAX_FILES_LIMIT} reviewable files. ({totalFileCount} found).</p>
                        </div>
                    ) : (
                        <div>
                             <div className="bg-base-100 p-3 rounded-lg border border-slate-700 mb-2">
                                <p className="text-sm text-slate-400">
                                    {totalFileCount} files found. <span className="font-semibold text-green-400">{selectedFiles.length}</span> will be sent for review.
                                </p>
                             </div>
                            <div className="bg-base-100 p-3 rounded-lg border border-slate-700 max-h-48 overflow-y-auto">
                                <ul className="space-y-1">
                                    {selectedFiles.map((file, index) => (
                                        <li key={index} className="text-sm text-slate-400 font-mono truncate">
                                            {/* @ts-ignore */}
                                            {file.webkitRelativePath || file.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};