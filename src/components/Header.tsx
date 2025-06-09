import { Download, Library, ChevronDown } from 'lucide-react';
import { useStore } from '../ConfigStore';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onOpenCustomFootprints: () => void;
}

export default function Header({ onOpenCustomFootprints }: HeaderProps) {
  const { configInput, customFootprints } = useStore();
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

  // Handler for downloading just the config YAML
  const downloadConfigYaml = () => {
    const blob = new Blob([configInput], { type: 'text/yaml' });
    saveAs(blob, 'config.yaml');
    setIsMenuOpen(false);
  };

  // Handler for downloading config and custom footprints as a zip
  const downloadConfigWithFootprints = () => {
    const zip = new JSZip();

    // Add config file
    zip.file('config.yaml', configInput);

    // Add custom footprints
    if (customFootprints.length > 0) {
      const footprintsDir = zip.folder('footprints');
      if (footprintsDir) {
        customFootprints.forEach((footprint) => {
          footprintsDir.file(`${footprint.name}.js`, footprint.content);
        });
      }
    }

    // Generate and download the zip
    zip
      .generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'ergogen-config-with-footprints.zip');
      })
      .catch((error: unknown) => {
        console.error(error);
      });
    setIsMenuOpen(false);
  };

  // Handler for downloading all resources (config, footprints, and generated files)
  const downloadAllResources = () => {
    const zip = new JSZip();
    const { results } = useStore.getState();

    // Add config file
    zip.file('config.yaml', configInput);

    // Add custom footprints
    if (customFootprints.length > 0) {
      const footprintsDir = zip.folder('footprints');
      if (footprintsDir) {
        customFootprints.forEach((footprint) => {
          footprintsDir.file(`${footprint.name}.js`, footprint.content);
        });
      }
    }

    // Add generated files (pcb, svg, dxf)
    if (Object.keys(results).length > 0) {
      // Add PCBs
      if (results.pcbs && Object.entries(results.pcbs).length > 0) {
        const pcbsDir = zip.folder('pcbs');
        if (pcbsDir) {
          for (const [name, content] of Object.entries(results.pcbs)) {
            if (content) {
              pcbsDir.file(`${name}.kicad_pcb`, content);
            }
          }
        }
      }

      // Add SVGs and DXFs
      if (results.outlines && Object.entries(results.outlines).length > 0) {
        const svgsDir = zip.folder('svgs');
        const dxfsDir = zip.folder('dxfs');
        if (svgsDir) {
          for (const [name, drawing] of Object.entries(results.outlines)) {
            svgsDir.file(`${name}.svg`, drawing.svg);
            dxfsDir?.file(`${name}.dxf`, drawing.dxf);
          }
        }
      }
    }

    // Generate and download the zip
    zip
      .generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'ergogen-all-resources.zip');
      })
      .catch((error: unknown) => {
        console.error(error);
      });
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full py-4 px-8 bg-gray-800 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">Ergogen Web</span>

        <div className="flex items-center space-x-4">
          <div className="flex items-center px-2">
            <button
              onClick={() => {
                useStore.getState().toggleAutoGenerate();
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${useStore.getState().autoGenerate ? 'bg-indigo-800' : 'bg-gray-600'}`}
              aria-pressed={useStore.getState().autoGenerate}
              aria-label="Toggle auto generation"
              type="button"
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
                    onClick={downloadConfigYaml}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white flex items-center gap-2"
                    type="button"
                  >
                    <Download size={16} />
                    <span>Download Config (YAML)</span>
                  </button>
                  <button
                    onClick={downloadConfigWithFootprints}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white flex items-center gap-2"
                    disabled={customFootprints.length === 0}
                    type="button"
                  >
                    <Download size={16} />
                    <span>Download with Footprints (ZIP)</span>
                  </button>
                  <button
                    onClick={downloadAllResources}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
