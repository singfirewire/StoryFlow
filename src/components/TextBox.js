import React, { useState, useMemo } from 'react';
import { X, Edit2, ChevronDown, Clock, User, Lock } from 'lucide-react';

const BOX_TYPES = {
  project: { name: 'Project', bgColor: 'bg-slate-50' },
  heading: { name: 'หัวข้อ', bgColor: 'bg-white' },
  narrative: { name: 'บทบรรยาย', bgColor: 'bg-blue-50' },
  interview: { name: 'สัมภาษณ์', bgColor: 'bg-green-50' },
  command: { name: 'คำสั่งพิเศษ', bgColor: 'bg-yellow-50' },
  comment: { name: 'ความเห็น', bgColor: 'bg-purple-50' },
  rollTitle: { name: 'Roll Title', bgColor: 'bg-slate-50' }
};

const calculateReadingTime = (content) => {
  if (!content) return { words: 0, time: 0 };
  const text = typeof content === 'object' ? content.additionalInfo || '' : content;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = wordCount / 200;
  return { words: wordCount, time: minutes };
};

const formatReadingTime = (minutes) => {
  if (minutes < 1) return `${Math.ceil(minutes * 60)} วินาที`;
  if (minutes >= 1) {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    if (secs === 0) return `${mins} นาที`;
    return `${mins} นาที ${secs} วินาที`;
  }
  return '0 วินาที';
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  });
};

const TextBox = ({ id, type, content, lastEdited, isLocked, index, onDragStart, onDragOver, onDrop, onDelete, onContentChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState(
    type === 'interview' 
      ? (typeof content === 'object' ? content : {
          fullName: '',
          position: '',
          interviewTime: '00:00:00,000',
          additionalInfo: ''
        })
      : content
  );

  const readingStats = useMemo(() => 
    calculateReadingTime(currentContent),
    [currentContent]
  );

  const handleSave = () => {
    onContentChange(id, currentContent);
    setIsEditing(false);
  };

  const handleInterviewFieldChange = (field, value) => {
    setCurrentContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div
      draggable={!isLocked}
      onDragStart={(e) => !isLocked && onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`${BOX_TYPES[type]?.bgColor || 'bg-white'} p-4 rounded-lg shadow-md mb-4 w-full max-w-4xl ${!isLocked ? 'cursor-move' : 'cursor-default'} relative group`}
    >
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {isLocked && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Lock size={14} />
            Locked
          </span>
        )}
        {lastEdited && (
          <span className="text-xs text-gray-400">
            แก้ไขล่าสุด {formatDate(lastEdited)}
          </span>
        )}
        <button 
          onClick={() => setIsEditing(true)}
          className="text-gray-400 hover:text-gray-600 flex items-center gap-1"
        >
          <Edit2 size={16} />
          <span className="text-xs">Edit</span>
        </button>
        {!isLocked && (
          <button 
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <h3 className="font-bold text-lg mb-4 mt-2">{BOX_TYPES[type]?.name || 'Box'}</h3>

      {isEditing ? (
        <div className="space-y-2">
          {type === 'interview' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={currentContent.fullName}
                  onChange={(e) => handleInterviewFieldChange('fullName', e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                  placeholder="ชื่อ-นามสกุลผู้ให้สัมภาษณ์"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">ตำแหน่ง</label>
                <input
                  type="text"
                  value={currentContent.position}
                  onChange={(e) => handleInterviewFieldChange('position', e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                  placeholder="ตำแหน่ง"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Timecode</label>
                <input
                  type="text"
                  value={currentContent.interviewTime}
                  onChange={(e) => handleInterviewFieldChange('interviewTime', e.target.value)}
                  className="w-full p-2 border rounded bg-white font-mono"
                  placeholder="00:00:00,000"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">เพิ่มเติม</label>
                <textarea
                  value={currentContent.additionalInfo}
                  onChange={(e) => handleInterviewFieldChange('additionalInfo', e.target.value)}
                  className="w-full p-2 border rounded bg-white min-h-[100px]"
                  placeholder="ข้อมูลเพิ่มเติม..."
                />
              </div>
            </div>
          ) : (
            <textarea
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              className="w-full p-2 border rounded bg-white min-h-[100px]"
              placeholder={`ใส่เนื้อหา${BOX_TYPES[type]?.name || 'Box'}...`}
            />
          )}
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            บันทึก
          </button>
        </div>
      ) : (
        <div className="mt-2">
          {type === 'interview' ? (
            <div className="space-y-2">
              {currentContent.fullName && (
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={16} className="text-gray-400" />
                  <p className="font-medium">{currentContent.fullName}</p>
                  <span className="text-gray-400">·</span>
                  <p className="text-gray-500">{currentContent.position}</p>
                </div>
              )}
              {currentContent.interviewTime && (
                <p className="text-sm text-gray-500 font-mono">
                  Timecode: {currentContent.interviewTime}
                </p>
              )}
              <div className="mt-4 whitespace-pre-wrap">
                {currentContent.additionalInfo || (
                  <span className="text-gray-400">คลิก Edit เพื่อเพิ่มเนื้อหา</span>
                )}
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {currentContent || <span className="text-gray-400">คลิก Edit เพื่อเพิ่มเนื้อหา</span>}
            </div>
          )}
        </div>
      )}

      {(type === 'interview' ? currentContent.additionalInfo : currentContent) && (
        <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
          <Clock size={12} />
          <span>เวลาในการอ่าน: {formatReadingTime(readingStats.time)} ({readingStats.words} คำ)</span>
        </div>
      )}
    </div>
  );
};

export default TextBox;
