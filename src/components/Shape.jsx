import React from 'react';
import { useDrag } from 'react-dnd';
import './Shape.css'; 

const Shape = ({ id, type, left, top, text, onEditText, startConnection }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'shape',
    item: { id, type, left, top, isNew: false },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleContextMenu = (e) => {
    e.preventDefault();
    const newText = prompt('Edit text:', text);
    if (newText !== null) {
      onEditText(id, newText);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    startConnection(id, left + rect.width / 2, top + rect.height / 2);
  };

  const shapeClassName = `shape ${type}`;

  return (
    <div
      id={id}
      ref={drag}
      className={shapeClassName}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        opacity: isDragging ? 0.5 : 1,
      }}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      {text}
    </div>
  );
};

export default Shape;
