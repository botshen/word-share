import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import cssText from "data-text:~/contents/plasmo-inline.css"
import iconImage from "data-base64:~assets/icon.png"

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
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasTextSelected, setHasTextSelected] = useState(false); // 新增状态

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection) return;
    if (selection.toString().trim() !== '') {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const offsetX = 10; // 可调节横向偏移量
      const offsetY = 4; // 可调节纵向偏移量
      setPosition({
        x: rect.right + window.scrollX - offsetX,
        y: rect.bottom + window.scrollY + offsetY
      });
      setIsVisible(true);
      setHasTextSelected(true);

      setTimeout(() => {
        setHasTextSelected(false);
      }, 100);
    }
  };

  const handleClick = (e: any) => {
    // 获取图标元素
    const button = document.getElementById('selection-button');

    // 判断点击是否发生在图标或图标的padding区内
    if (button && !button.contains(e.target)) {
      // 如果点击发生在外部，则隐藏图标
      setIsVisible(false);
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
            onClick={() => console.log('Button clicked')}
          >
            <img style={{ height: '16px', width: "16px" }} src={iconImage} />
          </div>
        )
      }
    </div>
  );
}

export default PlasmoInline
