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

function TodaysChecklist() {
  const [user] = useAuthState(auth);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItemLabel, setNewItemLabel] = useState('');

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
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={!!item.checkedAt}
              onChange={() => handleToggle(item.id)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ textDecoration: item.checkedAt ? 'line-through' : 'none' }}>
              {item.label}
            </span>
            
            {item.checkedAt && (
              <span style={{ marginLeft: '12px', color: '#555', fontSize: '0.8em' }}>
                (Completed at {item.checkedAt.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })})
              </span>
            )}

            <button onClick={() => handleDeleteItem(item)} style={{ marginLeft: 'auto' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItemLabel}
          onChange={e => setNewItemLabel(e.target.value)}
          placeholder="Add a new item"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default TodaysChecklist;