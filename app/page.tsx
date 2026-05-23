'use client';

import { useState, useEffect } from 'react';
import { initialData } from '@/data/mockData';
import { FileNode } from '@/types';
import Sidebar from '@/components/Sidebar';
import MainPanel from '@/components/MainPanel';

export default function Home() {
  const [fileSystem, setFileSystem] = useState<FileNode[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fileSystem');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to load from localStorage', e);
        }
      }
    }
    return initialData;
  });
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  useEffect(() => {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }, [fileSystem]);

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        fileSystem={fileSystem}
        currentFolderId={currentFolderId}
        selectedFile={selectedFile}
        onFolderSelect={setCurrentFolderId}
        onFileSelect={setSelectedFile}
      />
      <MainPanel
        fileSystem={fileSystem}
        currentFolderId={currentFolderId}
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
        onFolderSelect={setCurrentFolderId}
        onFileSystemChange={setFileSystem}
      />
    </div>
  );
}
