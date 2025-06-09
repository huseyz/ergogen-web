import { Download, Edit, Trash } from 'lucide-react';
import type { CustomFootprintConfig } from '../types';

interface CustomFootprintProps {
  customFootprint: CustomFootprintConfig;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function CustomFootprint(props: CustomFootprintProps) {
  return (
    <div
      className={
        'px-15 py-5 border-gray-800 flex items-center justify-between overflow-hidden' +
        (props.selected ? ' bg-gray-700' : '')
      }
    >
      <div className="">{props.customFootprint.name}</div>
      <div className="flex items-center space-x-2">
        <button
          className="p-2 rounded hover:bg-gray-700 transition"
          aria-label="Delete"
          onClick={() => {
            props.onDelete();
          }}
          type="button"
        >
          <Trash />
        </button>
        <a
          download={props.customFootprint.name + '.js'}
          className="p-2 rounded hover:bg-gray-700 transition"
          href={window.URL.createObjectURL(
            new Blob([props.customFootprint.content], { type: 'octet/stream' }),
          )}
          aria-label="Download"
        >
          <Download />
        </a>
        <button
          className="p-2 rounded hover:bg-gray-700 transition"
          aria-label="Edit"
          onClick={() => {
            props.onSelect();
          }}
          type="button"
        >
          <Edit />
        </button>
      </div>
    </div>
  );
}
