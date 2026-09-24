import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Hobby, Entry } from '../types';

interface StoreState {
  hobbies: Hobby[];
  entries: Entry[];
  addHobby: (hobby: Omit<Hobby, 'id' | 'createdAt'>) => void;
  updateHobby: (id: string, hobby: Partial<Omit<Hobby, 'id' | 'createdAt'>>) => void;
  deleteHobby: (id: string) => void;
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt'>) => void;
  deleteEntry: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      hobbies: [
        {
          id: '1',
          name: 'Reading',
          icon: 'BookOpen',
          color: '#3b82f6', // Blue
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Gym',
          icon: 'Dumbbell',
          color: '#ec4899', // Pink
          createdAt: Date.now(),
        },
      ],
      entries: [],
      
      addHobby: (hobby) => set((state) => ({
        hobbies: [...state.hobbies, { ...hobby, id: crypto.randomUUID(), createdAt: Date.now() }]
      })),
      
      updateHobby: (id, data) => set((state) => ({
        hobbies: state.hobbies.map(h => h.id === id ? { ...h, ...data } : h)
      })),
      
      deleteHobby: (id) => set((state) => ({
        hobbies: state.hobbies.filter(h => h.id !== id),
        entries: state.entries.filter(e => e.hobbyId !== id)
      })),
      
      addEntry: (entry) => set((state) => ({
        entries: [...state.entries.filter(e => !(e.hobbyId === entry.hobbyId && e.date === entry.date)), { ...entry, id: crypto.randomUUID(), createdAt: Date.now() }]
      })),

      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter(e => e.id !== id)
      })),
    }),
    {
      name: 'pulse-storage',
    }
  )
);
