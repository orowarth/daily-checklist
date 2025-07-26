import type { ChecklistItem } from '../firebase';

interface HistoryEntry {
  date: string;
  items: ChecklistItem[];
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: HistoryEntry | null;
}

const modalStyles = {
  backdrop: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
    maxWidth: '500px',
  },
};

function HistoryModal({ isOpen, onClose, entry }: HistoryModalProps) {
  if (!isOpen || !entry) {
    return null;
  }

  return (
    <div style={modalStyles.backdrop} onClick={onClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ float: 'right' }}>X</button>
        <h4>{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
        <ul style={{ listStyle: 'none', paddingLeft: '10px', fontSize: '14px' }}>
          {entry.items.map(item => (
            <li key={item.id}>
              {item.checkedAt ? '✅' : '🔲'} {item.label}
            </li>
          ))}
          {entry.items.length === 0 && <li>No items for this day.</li>}
        </ul>
      </div>
    </div>
  );
}

export default HistoryModal;