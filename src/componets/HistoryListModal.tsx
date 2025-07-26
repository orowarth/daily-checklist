import { useState } from 'react';
import type { HistoryEntry } from './ChecklistHistory';
import { modalStyles } from './modalStyles';

const buttonStyleBase = {
  width: '100%',
  padding: '12px 20px',
  fontSize: '16px',
  textAlign: 'center' as const,
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  color: '#333',
  cursor: 'pointer',
  transition: 'background-color 0.2s, transform 0.2s',
};

const buttonStyleHover = {
  backgroundColor: '#efefef',
  transform: 'translateY(-1px)',
};

interface HistoryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
}

const ITEMS_PER_PAGE = 10;

function HistoryListModal({ isOpen, onClose, history, onSelectEntry }: HistoryListModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null); // State for hover effect

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

  if (!isOpen) {
    return null;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = history.slice(startIndex, endIndex);

  return (
    <div style={modalStyles.backdrop} onClick={onClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>Checklist History</h4>
          <button onClick={onClose}>X</button>
        </div>
        
        {history.length === 0 && <p>No history found.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '15px 0' }}>
          {currentItems.map(entry => (
            <button 
              key={entry.date} 
              onClick={() => onSelectEntry(entry)}
              style={ hoveredButtonId === entry.date ? {...buttonStyleBase, ...buttonStyleHover} : buttonStyleBase }
              onMouseEnter={() => setHoveredButtonId(entry.date)}
              onMouseLeave={() => setHoveredButtonId(null)}
            >
              View {new Date(entry.date).toLocaleDateString()}
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryListModal;