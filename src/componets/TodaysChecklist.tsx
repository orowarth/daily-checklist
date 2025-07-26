import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import {
  auth,
  getOrCreateTodaysChecklist,
  updateChecklistItems,
  addItemToChecklist,
  deleteItemFromChecklist,
} from '../firebase';
import type {  ChecklistItem } from '../firebase'

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '20px', 
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  dateHeader: {
    marginTop: 0,
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    color: '#333',
    fontWeight: 500,
    fontSize: '1.2em',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  itemLabel: (checked: boolean) => ({
    textDecoration: checked ? 'line-through' : 'none',
    color: checked ? '#888' : '#333',
  }),
  completedText: {
    marginLeft: '12px',
    color: '#555',
    fontSize: '0.8em',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  addForm: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  addInput: {
    flex: 1,
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
};

function TodaysChecklist() {
  const [user] = useAuthState(auth);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItemLabel, setNewItemLabel] = useState('');

  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(undefined, dateOptions);
  
  useEffect(() => {
    if (user) {
      getOrCreateTodaysChecklist(user)
        .then(data => {
          setItems(data.items);
          setDocId(data.docId);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleToggle = async (itemId: string) => {
    if (!docId) return;

    const newItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, checkedAt: item.checkedAt ? null : Timestamp.now() };
      }
      return item;
    });
    setItems(newItems);
    await updateChecklistItems(docId, newItems);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId || !newItemLabel.trim()) return;

    const newItem: ChecklistItem = {
      id: uuidv4(),
      label: newItemLabel.trim(),
      checkedAt: null,
    };
    setItems([...items, newItem]); 
    setNewItemLabel('');
    await addItemToChecklist(docId, newItem);
  };

  const handleDeleteItem = async (itemToDelete: ChecklistItem) => {
    if (!docId) return;
    
    const newItems = items.filter(item => item.id !== itemToDelete.id);
    setItems(newItems);
    await deleteItemFromChecklist(docId, itemToDelete);
  };

  if (loading) return <p>Loading your checklist...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.dateHeader}>{formattedDate}</h2>

      <ul style={styles.list}>
        {items.map(item => (
          <li key={item.id} style={styles.listItem}>
            <input
              type="checkbox"
              checked={!!item.checkedAt}
              onChange={() => handleToggle(item.id)}
              style={{ marginRight: '10px' }}
            />
            <span style={styles.itemLabel(!!item.checkedAt)}>
              {item.label}
            </span>
            
            {item.checkedAt && (
              <span style={styles.completedText}>
                (Completed at {item.checkedAt.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })})
              </span>
            )}

            <button onClick={() => handleDeleteItem(item)} style={styles.deleteButton}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddItem} style={styles.addForm}>
        <input
          type="text"
          value={newItemLabel}
          onChange={e => setNewItemLabel(e.target.value)}
          placeholder="Add a new item"
          style={styles.addInput}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default TodaysChecklist;