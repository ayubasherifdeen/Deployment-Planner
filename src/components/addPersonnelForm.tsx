import type{ Personnel } from "../data/models";
import type{ Rank } from "../data/models";

export function addPersonnelForm(){
    return (
      <form>
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
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Rank
          </label>
          <select>
            {Rank.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>
            Availability
            <input type="range" />
          </label>
        </div>

        <label>
            Assigned Missions
            <input type="number"/>
        </label>
      </form>
    );
}