import PanZoom from 'react-easy-panzoom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useStore } from '../ConfigStore';
import { Download } from 'lucide-react';

interface PreviewTabContentProps {
  svg: string;
  name: string;
  dxf: string;
}

function PreviewTabContent(props: PreviewTabContentProps) {
  return (
    <PanZoom className="overflow-hidden h-full">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(props.svg)}`}
        draggable={false}
        style={{
          filter: 'invert(1)',
          height: '100%',
        }}
      />
    </PanZoom>
  );
}

export default function SvgPreview() {
  const { results } = useStore();
  return (
    <Tabs>
      <TabList>
        {Object.keys(results.outlines ?? {}).map((key) => (
          <Tab key={key}>{key}</Tab>
        ))}
        {results.demo?.svg && <Tab>demo</Tab>}
      </TabList>
      {Object.keys(results.outlines ?? {}).map((key) => {
        const url = URL.createObjectURL(
          new Blob([results.outlines?.[key].dxf ?? ''], { type: 'text/plain' }),
        );
        return (
          <TabPanel key={key}>
            <a
              href={url}
              download={`${key + Date.now().toString()}.dxf`}
              className="flex justify-center"
            >
              <Download />
            </a>
            <PreviewTabContent
              svg={results.outlines?.[key].svg ?? ''}
              name={key}
              dxf={results.outlines?.[key].dxf ?? ''}
            />
          </TabPanel>
        );
      })}
      {results.demo?.svg && (
        <TabPanel key="demo">
          <PreviewTabContent
            svg={results.demo.svg}
            name="demo"
            dxf={results.demo.dxf}
          />
        </TabPanel>
      )}
    </Tabs>
  );
}
