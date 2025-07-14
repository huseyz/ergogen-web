import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useStore } from '../ConfigStore';

export default function ConfigEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const { configInput, setConfigInput } = useStore();
  const debouncedConfigInput = useDebouncedCallback((value: string) => {
    setConfigInput(value);
  }, 500);

  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    setTimeout(() => {
      void editor.getAction('editor.action.formatDocument')?.run();
    }, 100);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pb-3">
      <Editor
        path="config.yaml"
        language="yaml"
        theme="vs-dark"
        value={configInput}
        onChange={(value) => debouncedConfigInput(value ?? '')}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: true,
          tabSize: 2,
        }}
        onMount={editorDidMount}
      />
    </div>
  );
}
