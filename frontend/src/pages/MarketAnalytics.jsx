import { marketService } from "../services/marketService";

const MarketAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        marketService.getAnalytics('Wheat')
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error("Analytics fetch failed", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="font-display text-2xl font-bold text-forest mb-2">Market Analytics</h2>
                    <p className="text-gray-600 font-body text-sm max-w-2xl">Compare market prices, historical trends, and crop multi-dimensional profiles.</p>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-olive/20 flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select className="bg-cream border border-olive/50 rounded-lg px-3 py-2 text-sm font-body text-forest focus:outline-none focus:border-harvest">
                        <option>Wheat</option>
                        <option>Rice</option>
                    </select>
                    <select className="bg-cream border border-olive/50 rounded-lg px-3 py-2 text-sm font-body text-forest focus:outline-none focus:border-harvest">
                        <option>All Markets</option>
                        <option>Delhi</option>
                    </select>
                    <button className="bg-forest text-cream px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-harvest transition">
                        <Filter className="w-4 h-4" /> Apply
                    </button>
                </div>
            </div>

            {loading ? (
                <Loader message="Loading advanced analytics..." />
            ) : (
                <>
                    {/* Top Full Width Chart */}
                    <div className="h-[400px]">
                        <MarketChart type="line" data={data.line} title="6-Month Price Trend Overview" />
                    </div>

                    {/* Bottom Split Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                        <MarketChart type="bar" data={data.bar} title="Current Price Comparison by Market" />
                        <MarketChart type="radar" data={data.radar} title="Crop Profitability Profile" />
                    </div>
                </>
            )}
        </div>
    );
};

export default MarketAnalytics;
