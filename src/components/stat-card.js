const colorMap = {
  green: {
    bg: "bg-green-500",
    text: "text-green-500",
    light: "bg-green-100",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-500",
    light: "bg-amber-100",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-500",
    light: "bg-blue-100",
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-500",
    light: "bg-red-100",
  },
};

export function StatCard({ title, value, percentage, color, icon }) {
  const colors = colorMap[color];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${colors.bg} p-2 rounded-full`}>{icon}</div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <div className="h-8 flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full ${i % 2 === 0 ? "h-4" : "h-2"} ${
                  colors.bg
                }`}
              ></div>
            ))}
          </div>
          <div className={`ml-auto flex items-center ${colors.text}`}>
            <span className="text-xs font-medium">{percentage}%</span>
            <div className={`w-2 h-2 rounded-full ${colors.bg} ml-1`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
