import Modal from 'react-modal';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import './App.css';
import { useStore } from './ConfigStore';
import ConfigEditor from './components/ConfigEditor';
import Console from './components/Console';
import CustomFootprints from './components/CustomFootprints';
import Header from './components/Header';
import Footer from './components/Footer';
import PcbPreview from './components/PcbPreview';
import SvgPreview from './components/SvgPreview';
import { parseSharableURL } from './utils/importExportUtils';
import { useEffect } from 'react';

Modal.setAppElement('#root');

function App() {
  const { libraryOpen, setLibraryOpen, results, setInput } = useStore();

  useEffect(() => {
    const parsedSharableURL = parseSharableURL(window.location.href);
    if (parsedSharableURL) {
      setInput(parsedSharableURL.config, parsedSharableURL.customFootprints);
      window.location.href = '/';
    }
  }, [setInput]);

  return (
    <div className="fixed inset-0 bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <Header
        onOpenCustomFootprints={() => {
          setLibraryOpen(true);
        }}
      />
      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Column: ConfigEditor */}
        <section className="w-1/3 bg-gray-900 border-r border-gray-800 flex items-center justify-center">
          <ConfigEditor />
        </section>
        <section className="w-2/3 flex flex-col h-full">
          {/* Preview row: 3/4 height */}
          <div className="flex-3/4 flex-grow-[2] basis-3/4 min-h-0 flex items-center justify-center overflow-hidden">
            <Tabs className="w-full h-full react-tabs">
              <TabList>
                {Object.keys(results.outlines ?? {}).length > 0 && (
                  <Tab>SVG</Tab>
                )}
                {Object.keys(results.pcbs ?? {}).length > 0 && <Tab>PCB</Tab>}
              </TabList>
              {Object.keys(results.outlines ?? {}).length > 0 && (
                <TabPanel>
                  <SvgPreview />
                </TabPanel>
              )}
              {Object.keys(results.pcbs ?? {}).length > 0 && (
                <TabPanel>
                  <PcbPreview />
                </TabPanel>
              )}
            </Tabs>
          </div>
          {/* Console row: 1/4 height */}
          <div className="flex-1/4 flex-grow basis-1/4 min-h-0 flex items-center justify-center border border-gray-600">
            <Console />
          </div>
        </section>
        {/* Custom Footprints Library Modal */}
        <Modal
          isOpen={libraryOpen}
          onRequestClose={() => {
            setLibraryOpen(false);
          }}
          contentLabel="Custom Footprints Library"
          style={{
            content: {
              inset: '10%',
              padding: 0,
            },
          }}
        >
          <CustomFootprints />
        </Modal>
      </main>
      <Footer />
    </div>
  );
}

export default App;
