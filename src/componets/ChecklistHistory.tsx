import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase-auth';
import { getChecklistHistory } from '../firebase-firestore';
import type { ChecklistItem } from '../types';
import HistoryListModal from './HistoryListModal';

export interface HistoryEntry {
  date: string;
  items: ChecklistItem[];
}

function ChecklistHistory() {
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [isListModalOpen, setIsListModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getChecklistHistory(user)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <>
      <button onClick={() => setIsListModalOpen(true)} disabled={loading}>
        {loading ? 'Loading...' : 'View History'}
      </button>

      <HistoryListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        history={history}
      />
    </>
  );
}

export default ChecklistHistory;