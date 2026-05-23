"use client";

import { useState } from "react";
import { FileNode } from "@/types";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  HardDrive,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  fileSystem: FileNode[];
  currentFolderId: string;
  selectedFile: FileNode | null;
  onFolderSelect: (id: string) => void;
  onFileSelect: (file: FileNode) => void;
}

interface FolderTreeProps {
  node: FileNode;
  currentFolderId: string;
  selectedFile: FileNode | null;
  onFolderSelect: (id: string) => void;
  onFileSelect: (file: FileNode) => void;
  level: number;
}

function FolderTree({
  node,
  currentFolderId,
  selectedFile,
  onFolderSelect,
  onFileSelect,
  level,
}: FolderTreeProps) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const isSelected = currentFolderId === node.id;
  const isFileSelected = selectedFile?.id === node.id;

  const hasChildren = node.children && node.children.length > 0;

  if (node.type === "file") {
    return (
      <div
        className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors duration-150 ${
          isFileSelected
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={() => onFileSelect(node)}
      >
        <span className="w-4 h-4" />
        <File size={16} className="text-slate-400" />
        <span className="text-sm font-medium truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors duration-150 ${
          isSelected
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={() => {
          onFolderSelect(node.id);
          if (hasChildren) {
            setIsOpen(!isOpen);
          }
        }}
      >
        {hasChildren && (
          <span className="w-4 h-4 flex items-center justify-center text-slate-400">
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        )}
        {!hasChildren && <span className="w-4 h-4" />}
        {isOpen ? (
          <FolderOpen size={16} className="text-blue-500" />
        ) : (
          <Folder size={16} className="text-slate-400" />
        )}
        <span className="text-sm font-medium truncate">{node.name}</span>
      </div>

      {isOpen && hasChildren && node.children && (
        <div>
          {node.children.map((child) => (
            <FolderTree
              key={child.id}
              node={child}
              currentFolderId={currentFolderId}
              selectedFile={selectedFile}
              onFolderSelect={onFolderSelect}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  fileSystem,
  currentFolderId,
  selectedFile,
  onFolderSelect,
  onFileSelect,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-lg shadow-sm"
      >
        <Menu size={20} className="text-slate-600" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive size={18} className="text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-700">File Explorer</h2>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-slate-100 rounded"
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {fileSystem.map((node) => (
            <FolderTree
              key={node.id}
              node={node}
              currentFolderId={currentFolderId}
              selectedFile={selectedFile}
              onFolderSelect={onFolderSelect}
              onFileSelect={onFileSelect}
              level={0}
            />
          ))}
        </div>
      </div>
    </>
  );
}
