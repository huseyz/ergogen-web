import { useEffect } from "react";
import { useStore } from "./ConfigStore";
import ergogen from "ergogen";

export default function ErogogenController() {
  const { configInput, customFootprints, setResults, libraryOpen, addLog, autoGenerate } = useStore();
  useEffect(() => {
    if (libraryOpen || !autoGenerate) return;
    customFootprints.forEach((customFootprint) => {
      const injectionValue = new Function("require", "const module = {};\n\n" + customFootprint.content + "\n\nreturn module.exports;")();
      try {
        ergogen.inject("footprint", customFootprint.name, injectionValue);
      } catch (e) {
        console.error("Failed to inject footprint", customFootprint.name, e);
      }
    });
    ergogen.process(configInput, true, addLog)
      .then(setResults)
      .catch((e) => {
        addLog(e.message, "error");
      })
  }, [configInput, customFootprints, libraryOpen, autoGenerate]);

  return <></>;
}