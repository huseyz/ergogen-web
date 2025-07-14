import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Results } from 'ergogen';
import type { ConfigBundle, CustomFootprintConfig } from '../types';

// Download just the config YAML
export const downloadConfigYaml = (name: string | undefined, configInput: string, onComplete?: () => void) => {
  const blob = new Blob([configInput], { type: 'text/yaml' });
  saveAs(blob, (name ? `${name}-` : '') + 'config.yaml');
  onComplete?.();
};

// Download config and custom footprints as a zip
export const downloadConfigWithFootprints = (
  name: string | undefined,
  configInput: string,
  customFootprints: CustomFootprintConfig[],
  onComplete?: () => void
) => {
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
      saveAs(content, (name ? `${name}-` : '') + 'ergogen-config-with-footprints.zip');
      onComplete?.();
    })
    .catch((error: unknown) => {
      console.error(error);
    });
};

// Download all resources (config, footprints, and generated files)
export const downloadAllResources = (
  name: string | undefined,
  configInput: string,
  customFootprints: { name: string; content: string }[],
  results: Results,
  onComplete?: () => void
) => {
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
          if (drawing.svg) svgsDir.file(`${name}.svg`, drawing.svg);
          if (drawing.dxf && dxfsDir) dxfsDir.file(`${name}.dxf`, drawing.dxf);
        }
      }
    }
  }

  // Generate and download the zip
  zip
    .generateAsync({ type: 'blob' })
    .then((content) => {
      saveAs(content, (name ? `${name}-` : '') + 'ergogen-all-resources.zip');
      onComplete?.();
    })
    .catch((error: unknown) => {
      console.error(error);
    });
};

export const createSharableURL = (baseUrl: string, configBundle: ConfigBundle): string => {
  const bundle = JSON.stringify(configBundle);
  const bundleBytes = new TextEncoder().encode(bundle);
  const bundleBase64 = btoa(Array.from(bundleBytes, (byte) => String.fromCodePoint(byte)).join(""));
  return `${baseUrl}/${configBundle.name}###${bundleBase64}`;
};

export const parseSharableURL = (url: string): ConfigBundle | undefined => {
  const bundleBase64 = url.split('###')[1];
  if (!bundleBase64) return undefined;
  const bundleBytes = atob(bundleBase64).split('').map((char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(new Uint8Array(bundleBytes))) as ConfigBundle;
};