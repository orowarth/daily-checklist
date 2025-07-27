import type { Timestamp } from "firebase/firestore";

export interface ChecklistItem {
  id: string;
  label: string;
  checkedAt: Timestamp | null;
}

export interface ChecklistTemplateItem {
    id: string;
    label: string;
}