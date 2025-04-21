"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function VisitorsChart() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

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
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
      },
    },
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: "Visitors",
        data: [40, 20, 30, 50, 40, 25, 45, 65, 40, 30, 45, 60],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: false,
      },
      {
        label: "New Users",
        data: [30, 40, 20, 45, 30, 50, 35, 45, 55, 40, 50, 35],
        borderColor: "#84cc16",
        backgroundColor: "rgba(132, 204, 22, 0.1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="h-[200px]">
      <Line options={options} data={data} />
    </div>
  );
}
