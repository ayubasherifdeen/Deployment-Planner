import { useState } from "react";
import type { Personnel, Rank } from "../data/models";

const RANK: Rank[] = ["General", "Colonel", "Captain", "Lieutenant", "Private"];

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
  "Reconnaisance",
];

interface AddPersonnelFormProps {
  onAdd: (personnel: Personnel, email: string, password: string) => void;
  onCancel: () => void;
}

export function AddPersonnelForm({ onCancel, onAdd }: AddPersonnelFormProps) {
  const [name, setName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [rank, setRank] = useState<Rank>("Private");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  // Bug fix: was React.SubmitEvent which doesn't exist — correct type is React.FormEvent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedSkills.length === 0) return;

    onAdd(
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        rank,
        skills: selectedSkills,
        assignedMissionIds: [], // always starts empty — gets populated via assignment
      },
      email.trim(),
      password,
    );
  };

  return (
    <form
      className="rounded-lg border border-blue-200 bg-blue-50 p-4"
      onSubmit={handleSubmit}
    >
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
        <select
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={(e) => setRank(e.target.value as Rank)}
          value={rank}
        >
          {RANK.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* ── Login credentials ── */}
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-100 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Login Credentials
        </p>

        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="personnel@deployforce.com"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="text" // visible so admin can note it down
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Minimum 6 characters"
            minLength={6}
            required
          />
          <p className="mt-1 text-xs text-blue-600">
            Share these credentials with the personnel member after adding.
          </p>
        </div>
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

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
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
