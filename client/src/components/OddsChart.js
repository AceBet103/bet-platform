import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

export default function OddsChart({ history }) {
  if (!history || history.length === 0) return <p>No odds history</p>;

  const data = {
    labels: history.map(h => new Date(h.date).toLocaleTimeString()),
    datasets: [
      {
        label: "Odds A",
        data: history.map(h => h.oddsA),
        borderWidth: 2
      },
      {
        label: "Odds B",
        data: history.map(h => h.oddsB),
        borderWidth: 2
      }
    ]
  };

  return <Line data={data} />;
}
