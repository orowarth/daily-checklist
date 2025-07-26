import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import TodaysChecklist from "../componets/TodaysChecklist";
import ChecklistHistory from '../componets/ChecklistHistory';

const styles = {
  dashboard: { display: 'flex', height: '100vh', fontFamily: 'sans-serif' },
  sidebar: { width: '300px', borderRight: '1px solid #ccc', padding: '20px', backgroundColor: '#f4f4f4' },
  mainContent: { flex: 1, padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
};

function Dashboard() {
  return (
    <div style={styles.dashboard}>
      <aside style={styles.sidebar}>
        <ChecklistHistory />
      </aside>
      <main style={styles.mainContent}>
        <div style={styles.header}>
            <h1>Today's Checklist</h1>
            <button onClick={() => signOut(auth)}>Sign Out</button>
        </div>
        <TodaysChecklist />
      </main>
    </div>
  );
}

export default Dashboard;