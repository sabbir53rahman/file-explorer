export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  content?: string;
  children?: FileNode[];
}
