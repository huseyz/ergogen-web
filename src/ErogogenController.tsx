import { useEffect } from 'react';
import { useStore } from './ConfigStore';
import ergogen from 'ergogen';

export default function ErogogenController() {
  const {
    configInput,
    customFootprints,
    setResults,
    libraryOpen,
    addLog,
    autoGenerate,
  } = useStore();
  useEffect(() => {
    if (libraryOpen || !autoGenerate) return;
    customFootprints.forEach((customFootprint) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-function-type
      const injectionValue: (params: unknown) => unknown = new Function(
        'require',
        'const module = {};\n\n' +
          customFootprint.content +
          '\n\nreturn module.exports;',
      )();
      try {
        ergogen.inject('footprint', customFootprint.name, injectionValue);
      } catch (e) {
        console.error('Failed to inject footprint', customFootprint.name, e);
      }
    });
    ergogen
      .process(configInput, true, addLog)
      .then(setResults)
      .catch((e: unknown) => {
        if (e instanceof Error) {
          addLog(e.message, 'error');
        } else {
          addLog('Unknown error', 'error');
        }
      });
  }, [
    configInput,
    customFootprints,
    libraryOpen,
    autoGenerate,
    addLog,
    setResults,
  ]);

  return <></>;
}
