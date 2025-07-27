import { signOut } from 'firebase/auth';
import { auth } from '../firebase-auth';
import TodaysChecklist from "../componets/TodaysChecklist";
import ChecklistHistory from '../componets/ChecklistHistory';
import styles from './Dashboard.module.css'; 

function Dashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Today's Checklist</h1>
        
        <div className={styles.actionsContainer}>
          <ChecklistHistory />
          <button onClick={() => signOut(auth)}>Sign Out</button>
        </div>
      </header>
      
      <main>
        <TodaysChecklist />
      </main>
    </div>
  );
}

export default Dashboard;