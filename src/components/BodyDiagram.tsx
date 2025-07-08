import React from 'react';

interface BodyDiagramProps {
  selectedArea: string;
  onAreaSelect: (area: string) => void;
}

const bodyAreas = [
  { id: 'head', label: 'Head', x: 50, y: 15 },
  { id: 'neck', label: 'Neck', x: 50, y: 25 },
  { id: 'chest', label: 'Chest', x: 50, y: 35 },
  { id: 'left-arm', label: 'Left Arm', x: 25, y: 40 },
  { id: 'right-arm', label: 'Right Arm', x: 75, y: 40 },
  { id: 'abdomen', label: 'Abdomen', x: 50, y: 50 },
  { id: 'back', label: 'Back', x: 50, y: 45 },
  { id: 'left-leg', label: 'Left Leg', x: 40, y: 70 },
  { id: 'right-leg', label: 'Right Leg', x: 60, y: 70 },
  { id: 'left-foot', label: 'Left Foot', x: 40, y: 90 },
  { id: 'right-foot', label: 'Right Foot', x: 60, y: 90 }
];

export const BodyDiagram: React.FC<BodyDiagramProps> = ({ selectedArea, onAreaSelect }) => {
  return (
    <div className="space-y-4">
      {/* Simple Body Diagram */}
      <div className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-8 h-96">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ maxWidth: '300px', margin: '0 auto', display: 'block' }}
        >
          {/* Body outline */}
          <ellipse cx="50" cy="15" rx="8" ry="10" fill="none" stroke="#6B7280" strokeWidth="1" />
          <rect x="45" y="25" width="10" height="8" fill="none" stroke="#6B7280" strokeWidth="1" />
          <rect x="42" y="33" width="16" height="20" fill="none" stroke="#6B7280" strokeWidth="1" />
          <rect x="45" y="53" width="10" height="15" fill="none" stroke="#6B7280" strokeWidth="1" />
          <rect x="35" y="68" width="8" height="20" fill="none" stroke="#6B7280" strokeWidth="1" />
          <rect x="57" y="68" width="8" height="20" fill="none" stroke="#6B7280" strokeWidth="1" />
          <rect x="25" y="35" width="15" height="8" fill="none" stroke="#6B7280" strokeWidth="1" />
          <rect x="60" y="35" width="15" height="8" fill="none" stroke="#6B7280" strokeWidth="1" />

          {/* Clickable areas */}
          {bodyAreas.map((area) => (
            <circle
              key={area.id}
              cx={area.x}
              cy={area.y}
              r="6"
              fill={selectedArea === area.id ? '#3B82F6' : '#10B981'}
              stroke="#ffffff"
              strokeWidth="2"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onAreaSelect(area.id)}
            />
          ))}
        </svg>
      </div>

      {/* Body Area Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {bodyAreas.map((area) => (
          <button
            key={area.id}
            onClick={() => onAreaSelect(area.id)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              selectedArea === area.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            {area.label}
          </button>
        ))}
      </div>

      {selectedArea && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Selected: <strong>{bodyAreas.find(area => area.id === selectedArea)?.label}</strong>
          </p>
        </div>
      )}
    </div>
  );
};