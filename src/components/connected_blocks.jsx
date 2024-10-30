import React, { useState, useCallback } from 'react';

const Block = ({ x, y, isDragging, onMouseDown, id }) => {
  const blockStyle = {
    position: 'absolute',
    width: '48px',
    height: '48px',
    backgroundColor: '#22c55e',
    borderRadius: '4px',
    cursor: 'move',
    opacity: 0.8,
    boxShadow: isDragging ? '0 10px 15px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)',
    transform: isDragging ? 'scale(1.1)' : 'scale(1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    left: x - 24,
    top: y - 24,
    touchAction: 'none',
    userSelect: 'none'
  };

  return (
    <div
      style={blockStyle}
      onMouseDown={(e) => onMouseDown(e, id)}
    />
  );
};

const ConnectingLine = ({ startPos, endPos }) => {
  const svgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: -1
  };

  return (
    <svg style={svgStyle}>
      <line
        x1={startPos.x}
        y1={startPos.y}
        x2={endPos.x}
        y2={endPos.y}
        stroke="#94a3b8"
        strokeWidth="2"
      />
    </svg>
  );
};

const ConnectedBlocks = () => {
  const [blocks, setBlocks] = useState([
    { id: '0', x: window.innerWidth / 2, y: window.innerHeight / 2, isDragging: false },
    { id: '1', x: window.innerWidth / 2 + 100, y: window.innerHeight / 2, isDragging: false }
  ]);
  const [draggedId, setDraggedId] = useState(null);

  const handleMouseDown = useCallback((e, id) => {
    e.preventDefault();
    setDraggedId(id);
    setBlocks(blocks.map(block => 
      block.id === id 
        ? { ...block, isDragging: true }
        : block
    ));
  }, [blocks]);

  const handleMouseMove = useCallback((e) => {
    if (draggedId !== null) {
      setBlocks(blocks.map(block =>
        block.id === draggedId
          ? { ...block, x: e.clientX, y: e.clientY }
          : block
      ));
    }
  }, [blocks, draggedId]);

  const handleMouseUp = useCallback(() => {
    if (draggedId !== null) {
      setBlocks(blocks.map(block =>
        block.id === draggedId
          ? { ...block, isDragging: false }
          : block
      ));
      setDraggedId(null);
    }
  }, [blocks, draggedId]);

  const addBlock = () => {
    const newBlock = {
      id: blocks.length.toString(),
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      isDragging: false
    };
    setBlocks([...blocks, newBlock]);
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh'
  };

  const buttonStyle = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'background-color 0.2s'
  };

  const buttonHoverStyle = {
    backgroundColor: '#2563eb'
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={addBlock}
        style={buttonStyle}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = buttonStyle.backgroundColor;
        }}
      >
        Add Block
      </button>
      
      {/* Draw lines between consecutive blocks */}
      {blocks.slice(1).map((block, index) => (
        <ConnectingLine
          key={`line-${index}`}
          startPos={{ x: blocks[index].x, y: blocks[index].y }}
          endPos={{ x: block.x, y: block.y }}
        />
      ))}
      
      {/* Render blocks */}
      {blocks.map(block => (
        <Block
          key={block.id}
          id={block.id}
          x={block.x}
          y={block.y}
          isDragging={block.isDragging}
          onMouseDown={handleMouseDown}
        />
      ))}
    </div>
  );
};

export default ConnectedBlocks;