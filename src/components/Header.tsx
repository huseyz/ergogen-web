import { Download, Library, ChevronDown } from 'lucide-react';
import { useStore } from '../ConfigStore';
import { useState, useRef, useEffect } from 'react';
import { downloadConfigYaml, downloadConfigWithFootprints, downloadAllResources, createSharableURL } from '../utils/importExportUtils';

interface HeaderProps {
  onOpenCustomFootprints: () => void;
}

export default function Header({ onOpenCustomFootprints }: HeaderProps) {
  const { configInput, customFootprints, results, addLog } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.title = `Ergogen Web - ${results.canonical?.metadata?.name ?? "Untitled"}`;
  }, [results]);

  // Handler for downloading just the config YAML
  const handleDownloadConfigYaml = () => {
    downloadConfigYaml(results.canonical?.metadata?.name, configInput, () => {
      setIsMenuOpen(false);
    });
  };

  // Handler for downloading config and custom footprints as a zip
  const handleDownloadConfigWithFootprints = () => {
    downloadConfigWithFootprints(results.canonical?.metadata?.name, configInput, customFootprints, () => {
      setIsMenuOpen(false);
    });
  };

  // Handler for downloading all resources (config, footprints, and generated files)
  const handleDownloadAllResources = () => {
    downloadAllResources(results.canonical?.metadata?.name, configInput, customFootprints, results, () => {
      setIsMenuOpen(false);
    });
  };

  // Handler for copying sharable URL
  const handleCopyShareableUrl = () => {
    navigator.clipboard.writeText(createSharableURL(window.location.origin, { name: results.canonical?.metadata?.name ?? "", config: configInput, customFootprints }))
      .then(() => {
        setIsMenuOpen(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          addLog("Failed to copy to clipboard: " + err.message, "error");
        } else {
          addLog("Failed to copy to clipboard: " + String(err), "error");
        }
      });
  };

  return (
    <header className="w-full py-1 px-8 bg-gray-800 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">Ergogen Web</span>

        <div className="flex items-center space-x-4">
          <div className="flex items-center px-2">
            <button
              onClick={() => {
                useStore.getState().toggleAutoGenerate();
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${useStore.getState().autoGenerate ? 'bg-green-600' : 'bg-gray-600'}`}
              aria-pressed={useStore.getState().autoGenerate}
              aria-label="Toggle auto generation"
              type="button"
              title='Auto generate'
            >
              <span
                className={`${useStore.getState().autoGenerate ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>

          <button
            className="p-2 rounded hover:bg-gray-700 transition"
            aria-label="Custom Footprints"
            onClick={onOpenCustomFootprints}
            type="button"
            title='Custom Footprints'
            >
            <Library />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              className="p-2 rounded hover:bg-gray-700 transition flex items-center gap-1"
              aria-label="Download options"
              aria-expanded={isMenuOpen}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              type="button"
            >
              <Download size={16} />
              <ChevronDown
                size={16}
                className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={handleDownloadConfigYaml}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white flex items-center gap-2"
                    type="button"
                  >
                    <Download size={16} />
                    <span>Download Config (YAML)</span>
                  </button>
                  <button
                    onClick={handleDownloadConfigWithFootprints}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white flex items-center gap-2"
                    type="button"
                  >
                    <Download size={16} />
                    <span>Download with Footprints (ZIP)</span>
                  </button>
                  <button
                    onClick={handleDownloadAllResources}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white flex items-center gap-2 border-t border-gray-700 mt-1 pt-2"
                    disabled={
                      Object.keys(useStore.getState().results).length === 0
                    }
                    type="button"
                  >
                    <Download size={16} className="text-green-400" />
                    <span className="font-medium">
                      Download All Resources (ZIP)
                    </span>
                  </button>
                  <button
                    onClick={handleCopyShareableUrl}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white flex items-center gap-2 border-t border-gray-700 mt-1 pt-2"
                    type="button"
                  >
                    <Download size={16} />
                    <span>
                      Copy Sharable URL
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
