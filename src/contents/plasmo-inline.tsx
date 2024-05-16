import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import cssText from "data-text:~/contents/plasmo-inline.css"
import iconImage from "data-base64:~assets/icon.png"
import { useStorage } from "@plasmohq/storage/hook"
import { storageConfig } from "~store"

// 匹配所有的网站
export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-words-share"

const PlasmoInline = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasTextSelected, setHasTextSelected] = useState(false); // 新增状态
  const [word, setWord] = useStorage<string>(storageConfig)

  // 当鼠标抬起时的事件处理
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      const selectedText = selection.toString(); // 获取选中的文本
      setWord(selectedText); // 把选中的文本保存起来

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPosition({
        x: rect.right + window.scrollX,
        y: rect.bottom + window.scrollY
      });
      setIsVisible(true); // 显示图标
      setHasTextSelected(true); // 标记已选择文本
    } else {
      setIsVisible(false); // 隐藏图标
      setHasTextSelected(false); // 标记未选择文本
    }
  };

  const handleClick = (e) => {
    const button = document.getElementById('selection-button');
    if (button && !button.contains(e.target)) {
      setIsVisible(false); // 当点击不在图标内部时，隐藏图标
    }
  };
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClick);
    };
  }, [hasTextSelected]); // 添加hasTextSelected作为依赖
  const handleShareWord = async () => {
    chrome.runtime.sendMessage({ type: "share" })
  }

  return (
    <div>
      {
        isVisible && (
          <div
            id="selection-button"
            style={{
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 213231233123,
              padding: '8px 8px 3px 8px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              cursor: 'pointer',
            }}
            onClick={handleShareWord}
          >
            <img style={{ height: '16px', width: "16px" }} src={iconImage} />
          </div>
        )
      }
    </div>
  );
}

export default PlasmoInline
