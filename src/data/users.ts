import type{ AppUser } from "./models"

export const USERS: AppUser[] = [
  {
    id: "u1",
    email: "admin@deployforce.com",
    password: "admin123",
    role: "admin",
    personnelId: null,
    name: "Admin",
  },
  {
    id: "u2",
    email: "adaeze@deployforce.com",
    password: "soldier123",
    role: "personnel",
    personnelId: "p1", 
    name: "Sgt. Adaeze Osei",
  },
  {
    id: "u3",
    email: "kwame@deployforce.com",
    password: "soldier123",
    role: "personnel",
    personnelId: "p2",
    name: "Lt. Kwame Asante",
  },
]

export default USERS