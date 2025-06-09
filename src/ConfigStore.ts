import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Results } from 'ergogen';
import type { CustomFootprintConfig } from './types';

interface ConfigStoreState {
  customFootprints: CustomFootprintConfig[];
  configInput: string;
  results: Results;
  libraryOpen: boolean;
  autoGenerate: boolean;
  logs: { message: string; type: 'info' | 'error' }[];
}

interface ConfigStoreActions {
  addCustomFootprint: (customFootprint: CustomFootprintConfig) => void;
  removeCustomFootprint: (customFootprint: CustomFootprintConfig) => void;
  updateCustomFootprint: (customFootprint: CustomFootprintConfig) => void;
  setConfigInput: (configInput: string) => void;
  setResults: (results: Results) => void;
  setLibraryOpen: (libraryOpen: boolean) => void;
  setAutoGenerate: (autoGenerate: boolean) => void;
  toggleAutoGenerate: () => void;
  addLog: (log: string, type: 'info' | 'error') => void;
}

type ConfigStore = ConfigStoreState & ConfigStoreActions;

export const useStore = create<ConfigStore>()(
  persist(
    (set) => ({
      customFootprints: [],
      configInput: '',
      results: {},
      libraryOpen: false,
      autoGenerate: true,
      logs: [],
      addCustomFootprint: (customFootprint: CustomFootprintConfig) => {
        set((state) => ({
          customFootprints: [...state.customFootprints, customFootprint],
        }));
      },
      removeCustomFootprint: (customFootprint: CustomFootprintConfig) => {
        set((state) => ({
          customFootprints: state.customFootprints.filter(
            (f) => f.id !== customFootprint.id,
          ),
        }));
      },
      updateCustomFootprint: (customFootprint: CustomFootprintConfig) => {
        set((state) => ({
          customFootprints: state.customFootprints.map((f) =>
            f.id === customFootprint.id ? customFootprint : f,
          ),
        }));
      },
      setConfigInput: (configInput: string) => {
        set((_) => ({
          configInput: configInput,
        }));
      },
      setResults: (results: Results) => {
        set((_) => ({
          results: results,
        }));
      },
      setLibraryOpen: (libraryOpen: boolean) => {
        set((_) => ({
          libraryOpen: libraryOpen,
        }));
      },
      setAutoGenerate: (autoGenerate: boolean) => {
        set((_) => ({
          autoGenerate: autoGenerate,
        }));
      },
      toggleAutoGenerate: () => {
        set((state) => ({
          autoGenerate: !state.autoGenerate,
        }));
      },
      addLog: (log: string, type: 'info' | 'error' = 'info') => {
        set((state) => {
          if (state.logs.length > 100) {
            state.logs = state.logs.slice(1);
          }
          return {
            logs: [...state.logs, { message: log, type: type }],
          };
        });
      },
    }),
    {
      name: 'ergogen-web-config',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
