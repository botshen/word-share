import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useRef, useEffect } from 'react'
import * as htmlToImage from 'html-to-image';
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { useStorage } from "@plasmohq/storage/hook";
import { storageConfig } from "~store";

function MyEditor() {
  const [word] = useStorage<string>(storageConfig)
  const nodeRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef(null);

  // 编辑器内容
  const [html, setHtml] = useState(word)

  const [editor, setEditor] = useState<IDomEditor | null>(null)

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
  }
  // 当 word 变更时，更新编辑器内容
  useEffect(() => {
    if (word) {
      setHtml(`<div>${word}</div>`);
    }
  }, [word]);

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  // Function to generate image from HTML
  const generateImage = () => {
    const node = nodeRef.current;
    if (node) {
      const alteredHtml = node.innerHTML + '<p><br></p>'; // 添加额外的底部边距
      node.innerHTML = alteredHtml;
      htmlToImage.toPng(node,{
        
      })
        .then((dataUrl) => {
          node.innerHTML = html; // 在截图后，重置为原来的HTML 
          const img = new Image();
          img.src = dataUrl;
          if (imgRef.current) {
            imgRef.current.innerHTML = ''; // 清除之前可能存在的图片 
            imgRef.current.appendChild(img);
          }
        })
        .catch((error) => {
          console.error('故障发生', error);
          node.innerHTML = html; // 如果发生错误，同样重置HTML

        });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '600px', flexShrink: 0 }}>
        <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ borderBottom: '1px solid #ccc' }}
          />
          <Editor
            defaultConfig={editorConfig}
            value={html}
            onCreated={setEditor}
            onChange={editor => setHtml(editor.getHtml())}
            mode="default"
            style={{ height: '500px', overflowY: 'hidden' }}
          />
        </div>

        <div
          ref={nodeRef}
          dangerouslySetInnerHTML={{ __html: html }}

        ></div>
        {html}
        <button onClick={generateImage}>Generate Image</button>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div ref={imgRef}></div>
      </div>
    </div>
  )
}

export default MyEditor;
