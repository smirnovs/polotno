import { defineStore } from 'pinia'

interface BookCoverState {
  coverData: Record<string, any>[];
}

export const useBookCoverStore = defineStore({
  id: 'bookCover',
  state: (): BookCoverState => ({
    coverData: [],
  }),
  actions: {
    addCover(data: Record<string, any>[]) {
      this.coverData = data;
    },
  },
});