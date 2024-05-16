import { useStorage } from "@plasmohq/storage/hook";
import * as htmlToImage from 'html-to-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { storageConfig } from "~store";
import { Resizable } from 're-resizable';
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';

function MyEditor() {
  const [word] = useStorage<string>(storageConfig)
  const imgRef = useRef(null);

  // 编辑器内容
  const [code, setCode] = useState("");
  const handleProcedureContentChange = (content, delta, source, editor) => {
    setCode(content);
    //let has_attribues = delta.ops[1].attributes || "";
    //console.log(has_attribues);
    //const cursorPosition = e.quill.getSelection().index;
    // this.quill.insertText(cursorPosition, "★");
    //this.quill.setSelection(cursorPosition + 1);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      // ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }]
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
    const node = reactQuillRef.current;


    // const node = document.createElement('div');
    // node.innerHTML = code + '<p><br></p>'; // add the content to the new node


    if (node) {
      // const alteredHtml = node.innerHTML + '<p><br></p>'; // 添加额外的底部边距
      // node.innerHTML = alteredHtml;
      console.log('node', node)
      htmlToImage.toPng(node, {
        backgroundColor: '#fff'
      })
        .then((dataUrl) => {
          node.innerHTML = code; // 在截图后，重置为原来的HTML 
          const img = new Image();
          img.src = dataUrl;
          if (imgRef.current) {
            imgRef.current.innerHTML = ''; // 清除之前可能存在的图片 
            imgRef.current.appendChild(img);
          }
        })
        .catch((error) => {
          console.error('故障发生', error);
          node.innerHTML = code; // 如果发生错误，同样重置HTML

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
    var node = document.querySelector(".ql-container") as HTMLElement; 
    const dataUrl = await htmlToImage.toPng(node, { cacheBust: true, })
    downloadjs(dataUrl, 'download.png', 'image/png');

  }

  useEffect(() => {
    if (reactQuillRef.current) {
      setQuill(reactQuillRef.current.getEditor());
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }} className="xxx" >
      <Resizable
        defaultSize={{
          width: 320,
          height: 200,
        }}
      >
        <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
          <ReactQuill
            ref={reactQuillRef}

            theme="snow"
            modules={modules}
            formats={formats}
            value={code}
            onChange={handleProcedureContentChange}
          />
        </div>
        <button onClick={generateImage}>Generate Image</button>
        <button onClick={onButtonClick}>Download Image </button>
      </Resizable>
    </div>
  )
}

export default MyEditor;
