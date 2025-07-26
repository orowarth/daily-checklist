import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getChecklistHistory } from '../firebase';
import type { ChecklistItem } from '../firebase';
import HistoryModal from './HistoryModal';

interface HistoryEntry {
  date: string;
  items: ChecklistItem[];
}

function ChecklistHistory() {
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    if (user) {
      getChecklistHistory(user)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleOpenModal = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  if (loading) return <p>Loading history...</p>;

  return (
    <div>
      <h2>Past 5 Days</h2>
      {history.length === 0 && <p>No history found.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {history.map(entry => (
          <button key={entry.date} onClick={() => handleOpenModal(entry)}>
            View {new Date(entry.date).toLocaleDateString()}
          </button>
        ))}
      </div>

      <HistoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        entry={selectedEntry}
      />
    </div>
  );
}

export default ChecklistHistory;