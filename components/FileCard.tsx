"use client";

import { FileNode } from "@/types";
import { File, Folder, Edit2, Trash2 } from "lucide-react";

interface FileCardProps {
  item: FileNode;
  onClick: () => void;
  onFolderClick?: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function FileCard({
  item,
  onClick,
  onFolderClick,
  onRename,
  onDelete,
}: FileCardProps) {
  const handleClick = () => {
    if (item.type === "folder" && onFolderClick) {
      onFolderClick();
    } else if (item.type === "file") {
      onClick();
    }
  };

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center">
        {item.type === "folder" ? (
          <Folder size={36} className="text-blue-500 mb-2" />
        ) : (
          <File size={36} className="text-slate-400 mb-2" />
        )}
        <span className="text-xs font-medium text-center truncate w-full text-slate-700 mb-1">
          {item.name}
        </span>
        {item.type === "file" && item.content && (
          <p className="text-xs text-slate-500 text-center line-clamp-2 w-full">
            {item.content}
          </p>
        )}
      </div>
      <div className="mt-2 flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
          className="p-1.5 hover:bg-slate-100 rounded transition-colors"
          title="Rename"
        >
          <Edit2 size={12} className="text-slate-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <Trash2 size={12} className="text-red-500" />
        </button>
      </div>
    </div>
  );
}
