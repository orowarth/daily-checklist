import { app } from './firebase-config';
import type  { User } from "firebase/auth";
import { 
  doc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
  limit,
  getFirestore,
} from "firebase/firestore";
import type { ChecklistItem } from './types';

export const db = getFirestore(app);


export async function getOrCreateTodaysChecklist(user: User): Promise<{ docId: string; items: ChecklistItem[] }> {
  const todayString = new Date().toISOString().split('T')[0];
  
  const q = query(
    collection(db, "dailyChecklists"), 
    where("userId", "==", user.uid),
    where("date", "==", todayString),
    limit(1)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return {
      docId: doc.id,
      items: doc.data().items as ChecklistItem[],
    };
  } 
  else {    
    const lastChecklistQuery = query(
        collection(db, "dailyChecklists"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
        limit(1)
    );
    const lastChecklistSnapshot = await getDocs(lastChecklistQuery);
    
    let newDailyItems: ChecklistItem[] = [];

    if (!lastChecklistSnapshot.empty) {
      const lastItems = lastChecklistSnapshot.docs[0].data().items as ChecklistItem[];
      
      newDailyItems = lastItems.map(item => ({
        ...item,
        checkedAt: null,
      }));
    }

    const newDocRef = await addDoc(collection(db, "dailyChecklists"), {
      userId: user.uid,
      date: todayString,
      items: newDailyItems,
    });
    
    return {
      docId: newDocRef.id,
      items: newDailyItems,
    };
  }
}

export async function updateChecklistItems(docId: string, newItems: ChecklistItem[]) {
  const docRef = doc(db, "dailyChecklists", docId);
  await updateDoc(docRef, { items: newItems });
}

export async function addItemToChecklist(docId: string, newItem: ChecklistItem) {
  const docRef = doc(db, "dailyChecklists", docId);
  await updateDoc(docRef, {
    items: arrayUnion(newItem)
  });
}

export async function deleteItemFromChecklist(docId: string, itemToDelete: ChecklistItem) {
  const docRef = doc(db, "dailyChecklists", docId);
  await updateDoc(docRef, {
    items: arrayRemove(itemToDelete)
  });
}

export async function getChecklistHistory(user: User): Promise<{date: string, items: ChecklistItem[]}[]> {
    const q = query(
        collection(db, "dailyChecklists"),
        where("userId", "==", user.uid),
        orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
        date: doc.data().date,
        items: doc.data().items as ChecklistItem[],
    }));
}