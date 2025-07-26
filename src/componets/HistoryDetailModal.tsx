import type { HistoryEntry } from './ChecklistHistory';
import { modalStyles } from './modalStyles';

interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: HistoryEntry | null;
}

function HistoryDetailModal({ isOpen, onClose, entry }: HistoryDetailModalProps) {
  if (!isOpen || !entry) {
    return null;
  }

  return (
    <div style={{ ...modalStyles.backdrop, zIndex: 1001 }} onClick={onClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
          <button onClick={onClose}>X</button>
        </div>
        <ul style={{ listStyle: 'none', paddingLeft: '10px', fontSize: '14px', marginTop: '15px' }}>
          {entry.items.map(item => (
            <li key={item.id} style={{ marginBottom: '5px' }}>
              {item.checkedAt ? '✅' : '🔲'} {item.label}
            </li>
          ))}
          {entry.items.length === 0 && <li>No items for this day.</li>}
        </ul>
      </div>
    </div>
  );
}

export default HistoryDetailModal;