return (
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100 transition hover:shadow-lg relative">
    <div className="flex items-center gap-2 mb-1">
      <span className="font-bold text-dark text-lg">{name}</span>
      {tags.length > 0 && (
        <span className="ml-2 text-xs text-primary bg-primary/10 rounded px-2 py-0.5">{tags.join(', ')}</span>
      )}
      {(onStreakEdit || onStreakComplete || onStreakDelete) && (
        <div className="ml-auto flex gap-2 absolute right-4 top-4">
          {onStreakEdit && (
            <button onClick={onStreakEdit} title="Edit" className="p-1 rounded hover:bg-primary/10 transition">
              <span role="img" aria-label="Edit">✏️</span>
            </button>
          )}
          {onStreakComplete && (
            <button onClick={onStreakComplete} title="Mark as Complete" className="p-1 rounded hover:bg-success/10 transition">
              <span role="img" aria-label="Complete">✔️</span>
            </button>
          )}
          {onStreakDelete && (
            <button onClick={onStreakDelete} title="Delete" className="p-1 rounded hover:bg-alert/10 transition">
              <span role="img" aria-label="Delete">🗑️</span>
            </button>
          )}
        </div>
      )}
    </div>
  </div>
) 