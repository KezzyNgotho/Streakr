"use client";
import { useState } from "react";

export default function AddPage() {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: Replace with contract call to registerHabit(name, frequency)
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-12 pb-28">
      <h2 className="text-2xl font-bold text-dark mb-6">Create a New Streak</h2>
      <form
        className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100"
        onSubmit={handleSubmit}
      >
        <input
          className="border rounded px-3 py-2 text-dark"
          name="name"
          placeholder="Streak name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 text-dark"
          name="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
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
        {success && <div className="text-success">Habit registered! (mock)</div>}
      </form>
    </div>
  );
} 