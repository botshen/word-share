
import MyEditor from "./word-editor";


export default function DeltaFlyerPage() {

  return (
    <div
      style={{
        background: "#2f3d4e",
        height: 'calc(100vh - 200px)', // Use calc() to subtract 50px from 100vh
        padding:'100px',
      }}>
      <MyEditor />
    </div>
  )
}
