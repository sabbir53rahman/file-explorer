"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

export default function RenameModal({
  isOpen,
  onClose,
  onRename,
  currentName,
}: RenameModalProps) {
  const [newName, setNewName] = useState(currentName);

  const handleRename = () => {
    if (!newName.trim()) return;
    onRename(newName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">Rename Item</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name..."
          className="w-full px-3 py-2 border border-slate-300 rounded mb-4 focus:outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
          }}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRename}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}
