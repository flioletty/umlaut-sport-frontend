import { Html } from "react-konva-utils";
import { Text } from "react-konva"
import React, { useEffect, useState } from "react";

const RETURN_KEY = 13;
const ESCAPE_KEY = 27;

export function EditableText({
  x,
  y,
  onChange,
  text,
  disabled
}) {
    const [isEditing, setIsEditing] = useState(false);
  
    function toggleEdit() {
      setIsEditing(!isEditing);
    }

  function handleEscapeKeys(e) {
    if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
      toggleEdit();
    }
  }

  function handleTextChange(e) {
    onChange(e.currentTarget.value);
  }

  if (isEditing && !disabled) {
    return (
        <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
            <input
                className="w-2/4 text-black text-xs bg-transparent border-b-2 focus:outline-none"
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleEscapeKeys}
            />
        </Html>
    );
  }
  return (
    <Text
      x={x}
      y={y}
      onDblClick={toggleEdit}
      onDblTap={toggleEdit}
      text={text}
    />
  );
}
