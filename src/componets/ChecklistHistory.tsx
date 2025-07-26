import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getChecklistHistory } from '../firebase';
import type { ChecklistItem } from '../firebase';
import HistoryListModal from './HistoryListModal';
import HistoryDetailModal from './HistoryDetailModal';

export interface HistoryEntry {
  date: string;
  items: ChecklistItem[];
}

function ChecklistHistory() {
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getChecklistHistory(user)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleOpenDetailModal = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
  };
  
  const handleCloseDetailModal = () => {
    setSelectedEntry(null);
  };
  
  const handleCloseListModal = () => {
    setIsListModalOpen(false);
    handleCloseDetailModal(); 
  };

  return (
    <>
      <button onClick={() => setIsListModalOpen(true)} disabled={loading}>
        {loading ? 'Loading...' : 'View History'}
      </button>

      <HistoryListModal
        isOpen={isListModalOpen}
        onClose={handleCloseListModal}
        history={history}
        onSelectEntry={handleOpenDetailModal}
      />

      <HistoryDetailModal
        isOpen={!!selectedEntry}
        onClose={handleCloseDetailModal}
        entry={selectedEntry}
      />
    </>
  );
}

export default ChecklistHistory;