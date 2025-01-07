import React, { useState } from 'react';
import TextBox from './components/TextBox';
import AddButton from './components/AddButton';
import Footer from './components/Footer';

const Board = () => {
  const [boxes, setBoxes] = useState([
    {
      id: 'project',
      content: '',
      type: 'project',
      lastEdited: null,
      isLocked: true
    },
    {
      id: 'rollTitle',
      content: '',
      type: 'rollTitle',
      lastEdited: null,
      isLocked: true
    }
  ]);

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (dropIndex === 0 || dropIndex === boxes.length - 1) return;
    
    const items = Array.from(boxes);
    const [reorderedItem] = items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, reorderedItem);
    
    setBoxes(items);
    setDraggedIndex(null);
  };

  const handleDelete = (id) => {
    setBoxes(boxes.filter(box => !box.isLocked && box.id !== id));
  };

  const handleContentChange = (id, newContent) => {
    setBoxes(boxes.map(box => 
      box.id === id 
        ? { ...box, content: newContent, lastEdited: new Date().toISOString() }
        : box
    ));
  };

  const addNewBox = (type) => {
    const newBox = {
      id: String(Date.now()),
      content: type === 'interview' ? {
        fullName: '',
        position: '',
        interviewTime: '00:00:00,000',
        additionalInfo: ''
      } : '',
      type: type,
      lastEdited: null
    };

    const rollTitleIndex = boxes.length - 1;
    const newBoxes = [
      ...boxes.slice(0, rollTitleIndex),
      newBox,
      boxes[rollTitleIndex]
    ];
    setBoxes(newBoxes);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 items-start">
          {boxes.map((box, index) => (
            <TextBox
              key={box.id}
              {...box}
              index={index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDelete={handleDelete}
              onContentChange={handleContentChange}
            />
          ))}
        </div>
      </div>
      <AddButton onAdd={addNewBox} />
      <Footer />
    </div>
  );
};

export default Board;
