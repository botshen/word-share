
import MyEditor from "./word-editor";

import '@/assets/style.css'
export default function DeltaFlyerPage() {

  return (
    <div
      style={{
        background: "#121212",
        height: '100vh', // Use calc() to subtract 50px from 100vh
        padding:'100px',
      }}>
      <MyEditor />
    </div>
  )
}
