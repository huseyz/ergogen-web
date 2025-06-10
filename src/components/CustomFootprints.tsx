import { Editor } from '@monaco-editor/react';
import { HardDriveUpload, Plus } from 'lucide-react';
import { useState } from 'react';
import CustomFootprint from './CustomFootprint';
import { useStore } from '../ConfigStore';
import type { CustomFootprintConfig } from '../types';

const defaultFootprintContent = `module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`;

export default function CustomFootprints() {
  const {
    customFootprints,
    addCustomFootprint,
    removeCustomFootprint,
    updateCustomFootprint,
  } = useStore();
  const [selectedCustomFootprint, setSelectedCustomFootprint] =
    useState<CustomFootprintConfig | null>(null);
  const [nextKey, setNextKey] = useState<number>(
    customFootprints.map((f) => f.id).reduce((a, b) => Math.max(a, b), 0) + 1,
  );

  // Automatically select the first footprint if none is selected and there are footprints available
  useState(() => {
    if (customFootprints.length > 0 && !selectedCustomFootprint) {
      setSelectedCustomFootprint(customFootprints[0]);
    }
  });

  // Handler for file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const newFootprint = {
      id: nextKey,
      name: file.name.replace(/\.js$/, ''),
      content: text,
    };
    setNextKey((key) => key + 1);
    addCustomFootprint(newFootprint);
    setSelectedCustomFootprint(newFootprint);
    // Reset input so same file can be uploaded again if needed
    e.target.value = '';
  };

  return (
    <div className="bg-gray-900 text-gray-100 flex flex-col w-full h-full">
      <header className="p-3 bg-gray-800">
        <h2 className="text-l underline-">Custom Footprints</h2>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <section className="w-2/5">
          <div>
            <div className="w-full h-full flex flex-col">
              {customFootprints.map((customFootprint) => (
                <CustomFootprint
                  key={customFootprint.id}
                  customFootprint={customFootprint}
                  selected={selectedCustomFootprint?.id === customFootprint.id}
                  onSelect={() => {
                    setSelectedCustomFootprint(customFootprint);
                  }}
                  onDelete={() => {
                    removeCustomFootprint(customFootprint);
                    if (selectedCustomFootprint?.id === customFootprint.id) {
                      setSelectedCustomFootprint(null);
                    }
                  }}
                />
              ))}
            </div>
            <div className="w-full flex items-center justify-center pt-5 space-x-2">
              <button
                className="p-1 rounded-4xl bg-green-800 hover:bg-green-700 transition"
                aria-label="New Custom Footprint"
                onClick={() => {
                  const newFootprint = {
                    id: nextKey,
                    name: 'custom_footprint_' + nextKey.toString(),
                    content: defaultFootprintContent,
                  };
                  setNextKey((key) => key + 1);
                  addCustomFootprint(newFootprint);
                  setSelectedCustomFootprint(newFootprint);
                }}
                type="button"
              >
                <Plus />
              </button>
              {/* Hidden file input for uploading JS files */}
              <input
                type="file"
                accept=".js"
                style={{ display: 'none' }}
                id="custom-footprint-upload-input"
                onChange={(e) => {
                  void handleFileUpload(e);
                }}
              />
              <button
                className="p-1 rounded-3xl bg-green-800 hover:bg-green-700 transition"
                aria-label="Upload Custom Footprint"
                onClick={() => {
                  document.getElementById('custom-footprint-upload-input')?.click();
                }}
                type="button"
              >
                <HardDriveUpload />
              </button>
            </div>
          </div>
        </section>
        <section className="w-3/5 px-5">
          <div>
            <div className="w-full">Footprint Name</div>
            <div className="w-full">
              <input
                className="border border-white rounded w-full"
                type="text"
                value={selectedCustomFootprint?.name ?? ''}
                disabled={!selectedCustomFootprint}
                onChange={(e) => {
                  if (selectedCustomFootprint) {
                    const updated = {
                      ...selectedCustomFootprint,
                      name: e.target.value,
                    };
                    updateCustomFootprint(updated);
                    setSelectedCustomFootprint(updated);
                  }
                }}
              />
            </div>
          </div>
          <div className="w-full h-full">
            <div>Footprint Code</div>
            <div className="w-full h-full flex items-center justify-center disabled">
              <Editor
                onChange={(value) => {
                  if (value === '') return;
                  if (selectedCustomFootprint) {
                    const updated = {
                      ...selectedCustomFootprint,
                      content: value ?? '',
                    };
                    updateCustomFootprint(updated);
                    setSelectedCustomFootprint(updated);
                  }
                }}
                defaultLanguage="javascript"
                theme="vs-dark"
                value={selectedCustomFootprint?.content ?? ''}
                options={{
                  readOnly: !selectedCustomFootprint,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: true,
                }}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
