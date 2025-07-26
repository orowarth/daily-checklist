import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import TodaysChecklist from "../componets/TodaysChecklist";
import ChecklistHistory from '../componets/ChecklistHistory';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  actionsContainer: {
    display: 'flex',
    gap: '10px',
  },
};

function Dashboard() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Today's Checklist</h1>
        
        <div style={styles.actionsContainer}>
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