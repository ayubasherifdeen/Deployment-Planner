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
    email: "sarah@deployforce.com",
    password: "soldier123",
    role: "personnel",
    personnelId: "p1", 
    name: "Sarah Chen",
  },
  {
    id: "u3",
    email: "marcus@deployforce.com",
    password: "soldier123",
    role: "personnel",
    personnelId: "p2",
    name: "Marcus Johnson",
  },
]

export default USERS