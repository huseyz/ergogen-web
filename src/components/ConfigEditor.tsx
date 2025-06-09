import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { configureMonacoYaml, type MonacoYaml } from 'monaco-yaml';
import { useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import ergogenSchema from '../../node_modules/ergogen/meta/schema.json';
import { useStore } from '../ConfigStore';
import YamlWorker from '../yaml.worker.js?worker';

let monacoYaml: MonacoYaml | undefined;

export default function ConfigEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const { configInput, setConfigInput } = useStore();
  const debouncedConfigInput = useDebouncedCallback(
    (value: string) => setConfigInput(value),
    500,
  );

  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    setTimeout(() => {
      editor.getAction('editor.action.formatDocument')?.run();
    }, 100);
  };

  const editorBeforeMount = async (monaco: any) => {
    if (monacoYaml) return;

    window.MonacoEnvironment = {
      getWorker(_, label) {
        switch (label) {
          case 'editorWorkerService':
            return new EditorWorker();
          case 'yaml':
            return new YamlWorker();
          default:
            throw new Error(`Unknown label ${label}`);
        }
      },
    };

    monacoYaml = await configureMonacoYaml(monaco, {
      enableSchemaRequest: true,
      hover: true,
      completion: true,
      schemas: [
        {
          schema: ergogenSchema,
          fileMatch: ['*'],
          uri: window.location.origin + '/ergogen-schema.json',
        },
      ],
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pb-3">
      <Editor
        path="config.yaml"
        language="yaml"
        theme="vs-dark"
        value={configInput}
        onChange={(value) => debouncedConfigInput(value || '')}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: true,
          tabSize: 2,
        }}
        onMount={editorDidMount}
        beforeMount={editorBeforeMount}
      />
    </div>
  );
}
