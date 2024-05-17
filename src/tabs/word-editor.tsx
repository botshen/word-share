import './xxx.scss'
import { useStorage } from "@plasmohq/storage/hook";
import * as htmlToImage from 'html-to-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { storageConfig } from "~store";
import { Resizable } from 're-resizable';
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';
import { Button } from '~components/ui/button';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from "@codemirror/view";


const buttonStyle = {
  color: "white",
  backgroundColor: "#323d4d",
  borderRadius: "10px",
  border: "none",
  padding: "10px 20px",
  fontSize: "14px",
  cursor: "pointer",
  marginLeft: "10px",
  marginTop: "10px"
};
function MyEditor() {
  const [word] = useStorage<string>(storageConfig)
  const imgRef = useRef(null);
  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  // 编辑器内容
  const [code, setCode] = useState("");
  const handleProcedureContentChange = (content, delta, source, editor) => {
    setCode(content);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: ['black', 'red', 'green', 'blue', 'orange', 'yellow', 'white'] }],
      [{ background: ['black', 'red', 'green', 'blue', 'orange', 'yellow', 'white'] }]
    ]
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font"
  ];





  // 当 word 变更时，更新编辑器内容
  useEffect(() => {
    if (word) {
      setCode(`${word}`);
      console.log('==============')
    }
  }, [word]);



  // Function to generate image from HTML
  const generateImage = () => {
    // const node = nodeRef.current;
    var node = document.querySelector(".ql-editor") as HTMLElement;


    // const node = document.createElement('div');
    // node.innerHTML = code + '<p><br></p>'; // add the content to the new node


    if (node) {
      // const alteredHtml = node.innerHTML + '<p><br></p>'; // 添加额外的底部边距
      // node.innerHTML = alteredHtml;
      console.log('node', node)
      htmlToImage.toPng(node, {
      })
        .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          if (imgRef.current) {
            imgRef.current.innerHTML = ''; // 清除之前可能存在的图片 
            imgRef.current.appendChild(img);
          }
        })
        .catch((error) => {
          console.error('故障发生', error);

        });
    }
  }
  const getHtml = () => {
    const quill = reactQuillRef.current;
    console.log('quill', quill)

  }
  // const onButtonClick = useCallback(() => {
  //   if (nodeRef.current === null) {
  //     return
  //   }

  //   htmlToImage.toPng(nodeRef.current, { cacheBust: true, })
  //     .then((dataUrl) => {
  //       const link = document.createElement('a')
  //       link.download = 'my-image-name.png'
  //       link.href = dataUrl
  //       link.click()
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [nodeRef])
  const reactQuillRef = useRef(null); // 创建对ReactQuill组件的引用
  const [quill, setQuill] = useState(null); // 使用state来持有Quill实例

  // const onButtonClick = useCallback(async () => {
  //   if (nodeRef.current === null) {
  //     return
  //   }
  //   console.log('reactQuillRef.current',nodeRef.current)
  //   const canvas = await html2canvas(nodeRef.current);
  //   const dataURL = canvas.toDataURL('image/png');
  //   downloadjs(dataURL, 'download.png', 'image/png');
  // }, [nodeRef])

  const onButtonClick = async () => {

    // const canvas = await html2canvas(document.querySelector(".ql-container"));
    // const dataURL = canvas.toDataURL('image/png');
    // downloadjs(dataURL, 'download.png', 'image/png');
    var node = document.querySelector(".ql-editor") as HTMLElement;
    const dataUrl = await htmlToImage.toPng(node, { cacheBust: true })
    downloadjs(dataUrl, 'download.png', 'image/png');

  }

  useEffect(() => {
    if (reactQuillRef.current) {
      setQuill(reactQuillRef.current.getEditor());
    }
  }, []);

  return (
    <div style={{ background: "white", height: '100%', display: 'flex', flexDirection: 'row', width: '900px', margin: 'auto' }} className="xxx" >
      <Resizable
        defaultSize={{
          width: 500,
          height: 200,
        }}
      >
        <CodeMirror value={value} height="200px" width='100%' extensions={[javascript({ jsx: true }), EditorView.lineWrapping]} onChange={onChange} />


        <div ref={imgRef} style={{ marginTop: '10px' }} />

        <Button onClick={generateImage}>Generate Image</Button>
        <Button onClick={onButtonClick}>Download Image </Button>
      </Resizable>
    </div>
  )
}

export default MyEditor;
