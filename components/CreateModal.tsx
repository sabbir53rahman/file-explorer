"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, type: "folder" | "file") => void;
}

export default function CreateModal({
  isOpen,
  onClose,
  onCreate,
}: CreateModalProps) {
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState<"folder" | "file">("folder");

  const handleCreate = () => {
    if (!itemName.trim()) return;
    onCreate(itemName, itemType);
    setItemName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">Create New Item</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter name..."
          className="w-full px-3 py-2 border border-slate-300 text-black rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
        />
        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="folder"
              checked={itemType === "folder"}
              onChange={(e) => setItemType(e.target.value as "folder" | "file")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-slate-700">Folder</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="file"
              checked={itemType === "file"}
              onChange={(e) => setItemType(e.target.value as "folder" | "file")}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-slate-700">File</span>
          </label>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
