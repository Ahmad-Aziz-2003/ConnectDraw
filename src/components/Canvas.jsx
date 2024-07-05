
import React, { useState, useEffect, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import Shape from './Shape';
import backgroundImage from '../assets/backgroundwhite1.jpg';


const Canvas = () => {
  const [shapes, setShapes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [draggingConnection, setDraggingConnection] = useState(null);

  useEffect(() => {
    const storedShapes = JSON.parse(localStorage.getItem('shapes'));
    if (storedShapes) {
      setShapes(storedShapes);
    }
    const storedConnections = JSON.parse(localStorage.getItem('connections'));
    if (storedConnections) {
      setConnections(storedConnections);
    }
  }, []);

  const saveCanvas = () => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
    localStorage.setItem('connections', JSON.stringify(connections));
  };

  const clearCanvas = () => {
    setShapes([]);
    setConnections([]);
    localStorage.removeItem('shapes');
    localStorage.removeItem('connections');
  };

  const addShape = useCallback((type, left, top, id) => {
    const newShape = { id, type, left, top, text: type.charAt(0).toUpperCase() + type.slice(1) };
    setShapes(prevShapes => [...prevShapes, newShape]);
  }, []);

  const editShapeText = (id, newText) => {
    setShapes(prevShapes =>
      prevShapes.map(shape => (shape.id === id ? { ...shape, text: newText } : shape))
    );
  };

  const startConnection = (id, x, y) => {
    setDraggingConnection({ startId: id, startX: x, startY: y, endX: x, endY: y });
  };

  const endConnection = (endId) => {
    if (draggingConnection && draggingConnection.startId !== endId) {
      const newConnection = { ...draggingConnection, endId };
      setConnections(prevConnections => [...prevConnections, newConnection]);
    }
    setDraggingConnection(null);
  };

  const onMouseMove = (e) => {
    if (draggingConnection) {
      const canvasRect = document.getElementById('canvas').getBoundingClientRect();
      const endX = e.clientX - canvasRect.left;
      const endY = e.clientY - canvasRect.top;
      setDraggingConnection(prev => ({
        ...prev,
        endX,
        endY
      }));
    }
  };

  const onMouseUp = (e) => {
    if (draggingConnection) {
      const endShape = shapes.find(shape => {
        const shapeRect = document.getElementById(shape.id).getBoundingClientRect();
        return (
          e.clientX >= shapeRect.left &&
          e.clientX <= shapeRect.right &&
          e.clientY >= shapeRect.top &&
          e.clientY <= shapeRect.bottom
        );
      });

      if (endShape) {
        endConnection(endShape.id);
      } else {
        setDraggingConnection(null);
      }
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'shape',
    drop: (item, monitor) => {
      if (item.isNew) {
        addShape(item.type, monitor.getSourceClientOffset().x, monitor.getSourceClientOffset().y, item.id);
      } else {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);

        setShapes(prevShapes =>
          prevShapes.map(shape =>
            shape.id === item.id ? { ...shape, left, top } : shape
          )
        );
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const getShapeCenter = (shape) => {
    const shapeElement = document.getElementById(shape.id);
    if (shapeElement) {
      const shapeRect = shapeElement.getBoundingClientRect();
      const canvasRect = document.getElementById('canvas').getBoundingClientRect();
      const centerX = shapeRect.left + shapeRect.width / 2 - canvasRect.left;
      const centerY = shapeRect.top + shapeRect.height / 2 - canvasRect.top;
      return { centerX, centerY };
    }
    return { centerX: shape.left, centerY: shape.top };
  };

  return (
    <><div><h1>ConnectDraw</h1></div>
    <div onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <div
        ref={drop}
        id="canvas"
        style={{
          width: '1000px',
          height: '1000px',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          position: 'relative',
          border: '1px solid #ccc',
          margin: '100px',
        }}
      >
        {shapes.map((shape) => (
          <Shape
            key={shape.id}
            {...shape}
            onEditText={editShapeText}
            startConnection={startConnection}
          />
        ))}
        {connections.map((conn, index) => {
          const startShape = shapes.find(shape => shape.id === conn.startId);
          const endShape = shapes.find(shape => shape.id === conn.endId);
          if (startShape && endShape) {
            const { centerX: startX, centerY: startY } = getShapeCenter(startShape);
            const { centerX: endX, centerY: endY } = getShapeCenter(endShape);
            return (
              <svg key={index} style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="black"
                  strokeWidth="2"
                />
              </svg>
            );
          }
          return null;
        })}
        {draggingConnection && (
          <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            <line
              x1={draggingConnection.startX}
              y1={draggingConnection.startY}
              x2={draggingConnection.endX}
              y2={draggingConnection.endY}
              stroke="black"
              strokeWidth="2"
            />
          </svg>
        )}
        {isOver && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />}
      </div>
      <div>
      <button onClick={saveCanvas} style={{ marginRight: '10px',
          marginLeft: '10px',
          background:'black',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          }}>Save</button>
      <button onClick={clearCanvas} style={{   background: 'darkgrey',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          color: 'black',
          cursor: 'pointer',
        }}>Delete</button>
      </div>
    </div>
    </>
  );
};

export default Canvas;