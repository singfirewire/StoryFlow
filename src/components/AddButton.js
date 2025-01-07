import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const BOX_TYPES = {
  project: { name: 'Project', bgColor: 'bg-slate-50' },
  heading: { name: 'หัวข้อ', bgColor: 'bg-white' },
  narrative: { name: 'บทบรรยาย', bgColor: 'bg-blue-50' },
  interview: { name: 'สัมภาษณ์', bgColor: 'bg-green-50' },
  command: { name: 'คำสั่งพิเศษ', bgColor: 'bg-yellow-50' },
  comment: { name: 'ความเห็น', bgColor: 'bg-purple-50' },
  rollTitle: { name: 'Roll Title', bgColor: 'bg-slate-50' }
};

const AddButton = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-200"
        >
          + เพิ่มกล่องข้อความ
          <ChevronDown size={16} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl py-2 w-48">
            {Object.entries(BOX_TYPES)
              .filter(([key]) => !['project', 'rollTitle'].includes(key))
              .map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    onAdd(key);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:${value.bgColor} flex items-center gap-2`}
                >
                  {value.name}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddButton;
