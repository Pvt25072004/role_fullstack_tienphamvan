import { Pie } from "react-chartjs-2";
import { calculateDomainReadingTime } from "../utils/time";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

export const DomainChart = ({ sessions }: { sessions: any[] }) => {
  const domainData = calculateDomainReadingTime(sessions);
  const pieData = {
    labels: Object.keys(domainData),
    datasets: [
      {
        data: Object.values(domainData).map((v: any) => v / 1000), // in seconds
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Reading Time by Domain (s)
      </h2>
      <Pie data={pieData} />
    </div>
  );
};
