import type { Mission } from "../data/models";


interface MatchPanelProps {
  missions: Mission[];
  missionName: string;
  onMissionChange: (name: string) => void;
  onMatch: () => void;
}

export function MakeMatchPanel({
  missions,
  missionName,
  onMissionChange,
  onMatch,
}: MatchPanelProps) {

  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault();
    onMatch();  
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="mission" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Select Mission to Match Personnel
        </label>
        <select
          id="mission"
          value={missionName}
          onChange={e => onMissionChange(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>— choose a mission —</option>
          {missions.map(m => (
            <option key={m.id} value={m.name}>{m.name}</option>
          ))}
        </select>
      </div>
 
      <button
        type="submit"
        onClick={onMatch}
        disabled={!missionName}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
        </svg>
        Match Personnel
      </button>
      </form>

      
      </>
    );
}

export default MakeMatchPanel;