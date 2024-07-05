import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar'
import './index.css'

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex' }}>
        <div  style={{ margin:'5px', borderRight: '4px solid black' ,backgroundColor:'darkgrey'}}> 
        <Toolbar />
        </div>
        <Canvas />
      </div>
    </DndProvider>
  );
};

export default App;
