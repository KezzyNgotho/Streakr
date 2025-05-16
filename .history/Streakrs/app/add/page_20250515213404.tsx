"use client";

export default function AddPage() {
  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-12 pb-28">
      <h2 className="text-2xl font-bold text-dark mb-6">Create a New Streak</h2>
      <form className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100">
        <input
          className="border rounded px-3 py-2 text-dark"
          name="name"
          placeholder="Streak name"
          required
        />
        <label htmlFor="frequency" className="sr-only">Frequency</label>
        <select
          id="frequency"
          className="border rounded px-3 py-2 text-dark"
          name="frequency"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition"
        >
          Create Streak
        </button>
      </form>
    </div>
  );
} 