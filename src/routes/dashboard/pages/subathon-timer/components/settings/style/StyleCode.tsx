import React, { useContext, useEffect, useState } from 'react';
import { SubathonTimerConfigCtx } from '../../../../../../../context/subathon-time';
import { cssToJson, jsonToCss } from '../../../../../../../services/utils';
import CodeEditor from '@uiw/react-textarea-code-editor';

function StyleCode({height}: {height: number}) {
  const [cssCode, setCssCode] = useState('' as string);
  const { subathonTimerStyle, setSubathonTimerStyle } = useContext(SubathonTimerConfigCtx);

  const handleCssCodeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCssCode(event.target.value);
    setSubathonTimerStyle(cssToJson(event.target.value));
    console.log(cssToJson(event.target.value));
  };

  useEffect(() => {
    setCssCode(jsonToCss(subathonTimerStyle));
  }, [subathonTimerStyle]);

  useEffect(() => {
    
    console.log(';height', height)
    return () => {
      
    }
  }, [height])
  
  
  return (
    <CodeEditor
      value={cssCode}
      language='css'
      placeholder='/* Css code */'
      onChange={handleCssCodeInput}
      padding={15}
      style={{
        fontSize: 12,
        backgroundColor: 'rgb(0,0,0,0.25)',
        borderRadius: 4,
        fontFamily: 'Consolas,Liberation Mono,Menlo,monospace',
        height: Math.max(height, 300)
      }}
    />
  );
}

export default StyleCode;
