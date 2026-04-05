"use client";


import {useState} from "react"
import type{ Mission, Priority } from "../data/models"

const COMMON_SKILLS = [
  "Leadership",
  "Cybersecurity",
  "Data Analysis",
  "Field Operations",
  "Communications",
  "Intelligence",
  "Logistics",
  "Medical",
  "Engineering",
  "Negotiation",
];


interface AddMissionMissionFormProps{
    onCancel:()=>void
    onAdd: (mission: Mission)=>void;
}

export function AddMissionForm({ onCancel, onAdd }:AddMissionMissionFormProps){
    const [name, setName] = useState("")
    const [priority, setPriority] = useState("")
    const PRIORITIES: Priority[] = ["Low", "Medium", "High"];
    const [requiredSkills, setrequiredSkills] = useState<string[]>([])
    const [assignedPersonnels, setAssignedPersonnels] = useState<string[]>([])

  const toggleSkill = (skill: string) => {
    setrequiredSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {    // ← add handler
    e.preventDefault();
    if (!name.trim() || requiredSkills.length === 0) return;

    onAdd({
      id:             crypto.randomUUID(),
      name:           name.trim(),
      priority:       priority as Priority,
      requiredSkills: requiredSkills,
      assignedPersonnel: assignedPersonnels
    });
  }
    return(
        <form
     
      className="rounded-lg border border-indigo-200 bg-indigo-50 p-4"
      onSubmit={handleSubmit}
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Add New Mission
      </h3>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Mission Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter mission name"
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Assigned Personnels
        </label>
        <input
          type="text"
          value={assignedPersonnels}
          onChange={(e) => setAssignedPersonnels([...assignedPersonnels, e.target.value])}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          hidden
          
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Required Skills (select at least one)
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                requiredSkills.includes(skill)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      
      
      <div className="flex gap-2">
        <button
          type="submit"
          
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Add Mission
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
    )
}