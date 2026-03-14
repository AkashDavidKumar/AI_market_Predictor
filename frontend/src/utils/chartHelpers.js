import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

// Register ChartJS plugins globally
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

/**
 * Transforms generic backend trend data into Line chart format
 */
export const formatLineChartData = (apiData) => {
    // apiData: [{ date: '2023-10', price: 1500 }, ...]
    if (!apiData || apiData.length === 0) return null;

    return {
        labels: apiData.map((d) => d.date),
        datasets: [
            {
                label: "Price Trend",
                data: apiData.map((d) => d.price),
                borderColor: "#F5A623", // Harvest Orange
                backgroundColor: "rgba(200, 180, 0, 0.4)", // Olive Gold with opacity
                fill: true,
                tension: 0.4,
            },
        ],
    };
};

/**
 * Transforms generic backend comparison data into Bar chart format
 */
export const formatBarChartData = (apiData) => {
    // apiData: [{ market: 'Delhi', price: 1200 }, ...]
    if (!apiData || apiData.length === 0) return null;

    return {
        labels: apiData.map((d) => d.market),
        datasets: [
            {
                label: "Comparison",
                data: apiData.map((d) => d.price),
                backgroundColor: apiData.map((_, idx) =>
                    idx % 2 === 0 ? "#F5A623" : "#4A5C1A" // Alternating colors
                ),
            },
        ],
    };
};

/**
 * Transforms generic backend crop profitability into Radar chart format
 */
export const formatRadarChartData = (apiData) => {
    // apiData: { labels: ['Yield', 'Demand', ...], values: [80, 90, ...] }
    if (!apiData || !apiData.labels) return null;

    return {
        labels: apiData.labels,
        datasets: [
            {
                label: "Crop Profile",
                data: apiData.values,
                backgroundColor: "rgba(200, 180, 0, 0.4)", // Olive Gold 40%
                borderColor: "#4A5C1A", // Forest Olive
                pointBackgroundColor: "#F5A623", // Harvest Orange
            },
        ],
    };
};

export const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "#FFF8D6", // Cream Ivory
            titleColor: "#4A5C1A", // Forest Olive
            bodyColor: "#4A5C1A",
            borderColor: "#C0390A", // Rust Red
            borderWidth: 1,
        },
    },
    scales: {
        x: {
            grid: { color: "#FFF8D6" },
            ticks: { color: "#4A5C1A" },
        },
        y: {
            grid: { color: "#FFF8D6" },
            ticks: { color: "#4A5C1A" },
        },
    },
};
