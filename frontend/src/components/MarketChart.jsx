import React from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import { defaultChartOptions } from "../utils/chartHelpers";

const MarketChart = ({ type = "line", data, title }) => {
    if (!data) return null;

    const renderChart = () => {
        switch (type) {
            case "line":
                return <Line data={data} options={defaultChartOptions} />;
            case "bar":
                return <Bar data={data} options={defaultChartOptions} />;
            case "radar":
                return <Radar data={data} options={{ ...defaultChartOptions, scales: { r: { ticks: { display: false } } } }} />;
            default:
                return <Line data={data} options={defaultChartOptions} />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(74,92,26,0.12)] border-l-4 border-harvest p-4 lg:p-6 w-full h-full flex flex-col">
            {title && (
                <h3 className="font-display text-forest text-lg font-bold mb-4">{title}</h3>
            )}
            <div className="flex-1 relative min-h-[250px]">
                {renderChart()}
            </div>
        </div>
    );
};

export default MarketChart;
