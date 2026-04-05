"use client";


import type { Personnel } from "../data/models";

interface WarningPanelProps {
  persons: Personnel[];
}

export function WarningPanel({ persons }: WarningPanelProps) {
   const overworked = persons.filter(p => p.assignedMissionIds.length >= 3)
   
  
 if (overworked.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
        <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-semibold text-green-700">All systems operational</p>
          <p className="text-sm text-green-600">No overwork warnings detected</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="space-y-2">
      {overworked.map(person => (
        <div key={person.id} className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
          <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-700">{person.name} is overworked</p>
            <p className="text-xs text-red-500">
              Availability at <strong>{availability}%</strong> — assigned to {person.assignedMissionIds.length} mission{person.assignedMissionIds.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}