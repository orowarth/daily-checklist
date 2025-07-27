import { useState, useRef } from 'react';
import type { HistoryEntry } from './ChecklistHistory';
import { modalStyles } from './modalStyles';
import styles from './HistoryListModal.module.css';

interface HistoryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
}

const ITEMS_PER_PAGE = 5;

function HistoryListModal({ isOpen, onClose, history }: HistoryListModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [openEntryDate, setOpenEntryDate] = useState<string | null>(null);

  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

  if (!isOpen) {
    return null;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = history.slice(startIndex, endIndex);
  
  const handleToggleAccordion = (date: string) => {
    const isOpening = openEntryDate !== date;
    setOpenEntryDate(isOpening ? date : null);

    if (isOpening) {
      setTimeout(() => {
        itemRefs.current[date]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 0);
    }
  };

  return (
    <div style={modalStyles.backdrop} onClick={onClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h4>Checklist History</h4>
          <button onClick={onClose} className={styles.closeButton}>X</button>
        </div>
        
        <div className={styles.listContainer}>
          {currentItems.length > 0 ? (
            currentItems.map(entry => (
              <div 
                key={entry.date} 
                className={styles.accordionItem}
                ref={el => { itemRefs.current[entry.date] = el; }}
              >
                <button 
                  className={styles.accordionHeader} 
                  onClick={() => handleToggleAccordion(entry.date)}
                >
                  <span>{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  <span className={`${styles.accordionIndicator} ${openEntryDate === entry.date ? styles.open : ''}`}>
                    ›
                  </span>
                </button>
                {openEntryDate === entry.date && (
                  <div className={styles.accordionBody}>
                    <ul>
                      {entry.items.map(item => (
                        <li key={item.id}>
                          {item.checkedAt ? '✅' : '🔲'} {item.label}
                        </li>
                      ))}
                      {entry.items.length === 0 && <li>No items for this day.</li>}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No history found.</p>
          )}
        </div>

        <div style={{ flexGrow: 1 }} /> 

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              « First
            </button>
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              ‹ Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
              Next ›
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              Last »
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryListModal;