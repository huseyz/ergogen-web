import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Results } from 'ergogen';
import type { CustomFootprintConfig } from './types';

const emptyConfig = `metadata:
  engine: "4.1.0"
  name: "Ergogen Web"
  author: "huseyz"
units:
  kx: cx
  ky: cy
points:
  zones:
    matrix:
      anchor:
        shift: [100, -100]
      columns:
        c1:
      rows:
        r1:
outlines:
  raw:
    - what: rectangle
      where: true
      size: [kx, ky]
pcbs:
  van:
    template: kicad8
    outlines:
      main:
        outline: raw
    footprints:
      choc_hotswap:
        what: choc
        where: true
        params:
          keycaps: true
          reverse: false
          hotswap: true
          from: "{{column_net}}"
          to: "{{colrow}}"
`

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
  setInput: (input: string, customFootprints: CustomFootprintConfig[]) => void;
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
      configInput: emptyConfig,
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
      setInput: (input: string, customFootprints: CustomFootprintConfig[]) => {
        set((_) => ({
          configInput: input,
          customFootprints: customFootprints,
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
