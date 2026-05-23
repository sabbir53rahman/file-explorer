'use client';

import { useState } from 'react';
import { FileNode } from '@/types';
import { Plus, FolderOpen, File, X, Save } from 'lucide-react';
import CreateModal from './CreateModal';
import RenameModal from './RenameModal';
import FileCard from './FileCard';

interface FileEditorProps {
  file: FileNode;
  onClose: () => void;
  onSave: (content: string) => void;
}

function FileEditor({ file, onClose, onSave }: FileEditorProps) {
  const [editingContent, setEditingContent] = useState(file.content || '');

  const handleSave = () => {
    onSave(editingContent);
  };

  return (
    <div className="flex-1 bg-slate-50 p-4 sm:p-6">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <File size={18} className="text-white" />
            <h2 className="text-sm font-medium text-white truncate">{file.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
          >
            <X size={14} />
            Close
          </button>
        </div>
        <div className="p-4">
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full h-64 sm:h-96 p-3 border border-slate-300 rounded font-mono text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            placeholder="Start typing..."
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const generateId = () => {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getBreadcrumbPath = (nodes: FileNode[], targetId: string): FileNode[] => {
  const path: FileNode[] = [];

  const findPath = (node: FileNode, currentPath: FileNode[]): boolean => {
    if (node.id === targetId) {
      path.push(...currentPath, node);
      return true;
    }

    if (node.children) {
      for (const child of node.children) {
        if (findPath(child, [...currentPath, node])) {
          return true;
        }
      }
    }

    return false;
  };

  for (const node of nodes) {
    if (findPath(node, [])) {
      break;
    }
  }

  return path;
};

interface MainPanelProps {
  fileSystem: FileNode[];
  currentFolderId: string;
  selectedFile: FileNode | null;
  onFileSelect: (file: FileNode | null) => void;
  onFolderSelect: (id: string) => void;
  onFileSystemChange: (fileSystem: FileNode[]) => void;
}

export default function MainPanel({
  fileSystem,
  currentFolderId,
  selectedFile,
  onFileSelect,
  onFolderSelect,
  onFileSystemChange,
}: MainPanelProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [itemToRename, setItemToRename] = useState<FileNode | null>(null);

  const breadcrumbPath = getBreadcrumbPath(fileSystem, currentFolderId);

  const getCurrentFolder = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = getCurrentFolder(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const currentFolder = getCurrentFolder(fileSystem, currentFolderId);

  const updateFileSystem = (
    nodes: FileNode[],
    targetId: string,
    updater: (node: FileNode) => FileNode
  ): FileNode[] => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return updater(node);
      }
      if (node.children) {
        return {
          ...node,
          children: updateFileSystem(node.children, targetId, updater),
        };
      }
      return node;
    });
  };

  const deleteFromFileSystem = (
    nodes: FileNode[],
    targetId: string
  ): FileNode[] => {
    return nodes
      .filter((node) => node.id !== targetId)
      .map((node) => ({
        ...node,
        children: node.children ? deleteFromFileSystem(node.children, targetId) : undefined,
      }));
  };

  const handleCreate = (name: string, type: 'folder' | 'file') => {
    const newItem: FileNode = {
      id: generateId(),
      name,
      type,
      parentId: currentFolderId,
      content: type === 'file' ? '' : undefined,
      children: type === 'folder' ? [] : undefined,
    };

    const updatedFileSystem = updateFileSystem(fileSystem, currentFolderId, (node) => ({
      ...node,
      children: [...(node.children || []), newItem],
    }));

    onFileSystemChange(updatedFileSystem);
  };

  const handleDelete = (id: string) => {
    const updatedFileSystem = deleteFromFileSystem(fileSystem, id);
    onFileSystemChange(updatedFileSystem);
    if (selectedFile?.id === id) {
      onFileSelect(null);
    }
  };

  const handleRename = (newName: string) => {
    if (!itemToRename) return;
    const updatedFileSystem = updateFileSystem(fileSystem, itemToRename.id, (node) => ({
      ...node,
      name: newName,
    }));
    onFileSystemChange(updatedFileSystem);
    setItemToRename(null);
  };

  const openRenameModal = (item: FileNode) => {
    setItemToRename(item);
    setShowRenameModal(true);
  };

  const handleSaveContent = (content: string) => {
    if (!selectedFile) return;

    const updatedFileSystem = updateFileSystem(fileSystem, selectedFile.id, (node) => ({
      ...node,
      content,
    }));

    onFileSystemChange(updatedFileSystem);
    onFileSelect({ ...selectedFile, content });
    alert('File saved!');
  };

  if (selectedFile && selectedFile.type === 'file') {
    return (
      <FileEditor
        key={selectedFile.id}
        file={selectedFile}
        onClose={() => onFileSelect(null)}
        onSave={handleSaveContent}
      />
    );
  }

  return (
    <div className="flex-1 bg-slate-50 p-4 sm:p-6">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FolderOpen size={18} className="text-white shrink-0" />
            <div className="flex items-center gap-1.5 text-sm text-white overflow-hidden">
              {breadcrumbPath.map((folder, index) => (
                <div key={folder.id} className="flex items-center gap-1.5">
                  <button
                    onClick={() => onFolderSelect(folder.id)}
                    className="hover:text-blue-300 transition-colors truncate"
                  >
                    {folder.name}
                  </button>
                  {index < breadcrumbPath.length - 1 && (
                    <span className="text-slate-400 shrink-0">/</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors shrink-0"
          >
            <Plus size={14} />
            New
          </button>
        </div>

        <CreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />

        <RenameModal
          isOpen={showRenameModal}
          onClose={() => setShowRenameModal(false)}
          onRename={handleRename}
          currentName={itemToRename?.name || ''}
        />

        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {currentFolder?.children?.map((item) => (
              <FileCard
                key={item.id}
                item={item}
                onClick={() => onFileSelect(item)}
                onFolderClick={() => onFolderSelect(item.id)}
                onRename={() => openRenameModal(item)}
                onDelete={() => {
                  if (confirm(`Delete ${item.name}?`)) {
                    handleDelete(item.id);
                  }
                }}
              />
            ))}
          </div>

          {(!currentFolder?.children || currentFolder.children.length === 0) && (
            <div className="text-center py-12">
              <FolderOpen size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">This folder is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
