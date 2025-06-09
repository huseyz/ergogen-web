import { Download } from "lucide-react";
import { useStore } from "../ConfigStore";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

export interface PcbPreviewTabContentProps {
  source: string;
}

function PcbPreviewTabContent(props: PcbPreviewTabContentProps) {
  return (
    <kicanvas-embed
      key={props.source}
      src={props.source}
      type="pcb"
      controls="all"
      zoom="page"
    />
  );
}

export default function PcbPreview() {
  const { results } = useStore();

  return (
    <Tabs>
      <TabList>
        {Object.keys(results.pcbs || {}).map((key) => {
          return <Tab key={key}>{key}</Tab>;
        })}
      </TabList>
      {Object.keys(results.pcbs || {}).map((key) => {
        const url = URL.createObjectURL(
          new Blob([results.pcbs?.[key] || ""], { type: "text/plain" })
        );
        return (
          <TabPanel key={key}>
            <a href={url} download={`${key + Date.now()}.kicad_pcb`} className="flex justify-center">
              <Download />
            </a>
            <PcbPreviewTabContent source={url} />
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
