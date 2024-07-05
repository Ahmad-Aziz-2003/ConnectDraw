import React from 'react';
import { useDrag } from 'react-dnd';

const shapes = ['rectangle', 'diamond', 'circle', 'parallelogram'];

const Toolbar = () => {
  return (
    <div style={{ padding: '10px', borderRight: '1px solid #ccc' }}>
      <h1>Shapes</h1>
      {shapes.map(shape => (
        <ToolbarItem key={shape} type={shape} />
      ))}
    </div>
  );
};

const ToolbarItem = ({ type }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'shape',
    item: { type, left: 0, top: 0, id: Math.random().toString(36).substring(7), isNew: true },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    
    <div
      ref={drag}
      style={{
        padding: '10px',
        margin: '5px 0',
        backgroundColor: 'lightgrey',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        textAlign: 'center',
        borderRadius:'20%'
      }
    }
    >
      
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </div>
  );
};

export default Toolbar;
