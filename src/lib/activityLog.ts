// src/lib/logActivity.ts
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type ActionType =
  | "personnel_added"
  | "personnel_removed"
  | "mission_created"
  | "mission_removed"
  | "personnel_assigned"
  | "personnel_unassigned"
  | "mission_completed"
  | "admin_logout"
  | "personnel_logout";

export type Category = "personnel" | "mission" | "auth";

interface LogParams {
  action:      ActionType;
  category:    Category;
  description: string;       
  actorId:     string;
  actorName:   string;
  actorRole:   "admin" | "personnel";
  targetName:  string;       // name of person or mission affected
  metadata?:   Record<string, any>; // optional extra detail
}

export async function logActivity(params: LogParams) {
  try {
    await addDoc(collection(db, "activityLog"), {
      ...params,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}