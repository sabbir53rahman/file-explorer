import { FileNode } from '@/types';

export const initialData: FileNode[] = [
  {
    id: 'root',
    name: 'Root',
    type: 'folder',
    parentId: null,
    children: [
      {
        id: 'folder-1',
        name: 'Documents',
        type: 'folder',
        parentId: 'root',
        children: [
          {
            id: 'file-1',
            name: 'notes.txt',
            type: 'file',
            parentId: 'folder-1',
            content: 'This is my notes file'
          },
          {
            id: 'file-2',
            name: 'todo.txt',
            type: 'file',
            parentId: 'folder-1',
            content: 'Buy groceries\nFinish project'
          }
        ]
      },
      {
        id: 'folder-2',
        name: 'Projects',
        type: 'folder',
        parentId: 'root',
        children: [
          {
            id: 'folder-3',
            name: 'Web App',
            type: 'folder',
            parentId: 'folder-2',
            children: [
              {
                id: 'file-3',
                name: 'index.html',
                type: 'file',
                parentId: 'folder-3',
                content: '<html><body>Hello World</body></html>'
              }
            ]
          }
        ]
      },
      {
        id: 'file-4',
        name: 'readme.txt',
        type: 'file',
        parentId: 'root',
        content: 'Welcome to File Explorer'
      }
    ]
  }
];
