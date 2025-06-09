import { useStore } from "../ConfigStore";
import ScrollToBottom from "react-scroll-to-bottom";

export default function Console() {
  const { logs } = useStore();
  return (
    <ScrollToBottom className="w-full h-full text-left overflow-scroll bg-gray-950">
      {logs.map((log, index) => (
        <div key={index} className={`p-2 ${log.type === "error" ? "text-red-500" : "text-white"}`}>{"> " + log.message}</div>
      ))}
    </ScrollToBottom>
  );
}