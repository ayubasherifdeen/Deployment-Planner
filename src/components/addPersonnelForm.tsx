"use client";

import { useState } from "react";
import type{ Personnel, Rank } from "../data/models";

const RANK:Rank[]=["General","Colonel", "Captain", "Lieutenant", "Private"]
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

interface AddPersonnelFormProps {
  onAdd: (personnel:Personnel)=> void;
  onCancel: () => void;
}
export function AddPersonnelForm({ onCancel, onAdd }:AddPersonnelFormProps){
  const [name, setName]= useState("")
  const [availability, setAvailability] = useState(100);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [rank, setRank] = useState<Rank>("Private");
  const [assignedMissions, setAssignedMissions] = useState(0)

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedSkills.length === 0) return;

    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      rank,
      skills: selectedSkills,
      availability,
      assignedMissions
    })
  };
  
    return (
      <form className="rounded-lg border border-blue-200 bg-blue-50 p-4"
      onSubmit={handleSubmit}>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Add New Personnel
        </h3>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Rank
          </label>
          <select  className="w-full rounded-lg border border-gray-300 px-3 py-2          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={(e) => setRank(e.target.value as Rank)}
            value={rank}
            >
            {RANK.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Assigned Missions
          </label>
          <input type="number"   className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value = {assignedMissions}
          onChange={(e) => setAssignedMissions(Number(e.target.value))}
          min={0}/>
        </div>
       <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Availability:{availability}%
        </label>
        <input className="mb-2"
          type="range"
          min="0"
          max="100"
          value={availability}
          onChange={(e) => setAvailability(Number(e.target.value))}
      
        />
      </div>
      
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Skills (select at least one)
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                selectedSkills.includes(skill)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label>
            <input type="number" />
        </label>
        
      </div>
          
        <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          onSubmit={handleSubmit}
          
        >
          Add Personnel
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
    );
}