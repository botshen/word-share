import { useStorage } from "@plasmohq/storage/hook";
import { storageConfig } from "~store";


export default function DeltaFlyerPage() {
  const [word, setWord] = useStorage<string>(storageConfig)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>Delta Flyer Tab</h2>

      <p>{word}</p>
    </div>
  )
}
