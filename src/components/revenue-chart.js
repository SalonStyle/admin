"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function RevenueChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
  };

  const data = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [
      {
        data: [400, 650, 950, 800, 700, 500, 400],
        backgroundColor: "#3b82f6",
        borderColor: "transparent",
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };

  return (
    <div className="h-[150px] flex items-end">
      <Bar options={options} data={data} />
      {/* <div className="flex justify-between w-full mt-4 px-4">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i === 3 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {day}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
