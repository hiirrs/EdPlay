import { create } from 'zustand';

export type ContentData = {
  id: number;
  contentTitle: string;
  contentType: 'TEXT' | 'VIDEO' | 'FILE' | 'LINK';
  contentData: string;
  filePath?: string;
  file?: File;
};

interface ContentStore {
  contents: ContentData[];
  addContent: (content: ContentData) => void;
  updateContent: (id: number, updated: Partial<ContentData>) => void;
  removeContent: (id: number) => void;
  resetContents: () => void;
  setAllContents: (contents: ContentData[]) => void;
  initializeContents: (serverContents: Omit<ContentData, 'id'>[]) => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  contents: [],
  addContent: (content) =>
    set((state) => ({
      contents: [...state.contents, content],
    })),
  updateContent: (id, updated) =>
    set((state) => ({
      contents: state.contents.map((c) =>
        c.id === id ? { ...c, ...updated } : c
      ),
    })),
  removeContent: (id) =>
    set((state) => ({
      contents: state.contents.filter((c) => c.id !== id),
    })),
  resetContents: () => set({ contents: [] }),
  setAllContents: (contents) => set({ contents }),
  initializeContents: (serverContents) =>
    set({
      contents: serverContents.map((c) => ({
        ...c,
        id: Date.now() + Math.random(), 
      })),
    }),
}));
