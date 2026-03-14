import React, { useState, useEffect } from "react";
import { alertService } from "../services/alertService";
import { predictionService } from "../services/predictionService";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { useToast } from "../components/Toast";
import { BellPlus, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        crop: "",
        condition: "above",
        targetPrice: "",
    });

    const fetchData = async () => {
        try {
            const c = await predictionService.getCropSuggestions();
            setCrops(c.length ? c.map(x => typeof x === 'string' ? x : x.name) : ["Wheat", "Rice"]);

            const a = await alertService.getUserAlerts();
            // Dummy if backend empty
            if (a && a.length > 0) {
                setAlerts(a);
            } else {
                setAlerts([
                    { id: 1, crop: "Wheat", condition: "above", targetPrice: 2200, status: "active" },
                    { id: 2, crop: "Rice", condition: "below", targetPrice: 2900, status: "triggered" },
                ]);
            }
        } catch (err) {
            setError("Failed to load alerts data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreateAlert = async (e) => {
        e.preventDefault();
        try {
            // Assuming backend returns new alert obj or simply success
            await alertService.createAlert(formData);
            addToast(`Alert set for ${formData.crop} ${formData.condition} ₹${formData.targetPrice}`, "success");

            // Opt temp add to UI
            const newAlert = { id: Date.now(), ...formData, status: "active" };
            setAlerts([newAlert, ...alerts]);
            setFormData({ crop: "", condition: "above", targetPrice: "" });
        } catch (err) {
            addToast("Failed to create alert due to connection issue.", "error");
        }
    };

    const handleDelete = (id) => {
        // No backend DELETE endpoint in spec, simulating UI removal
        setAlerts((prev) => prev.filter((a) => a.id !== id));
        addToast("Alert removed", "warning");
    };

    if (loading) return <Loader message="Loading your price alerts..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="h-full flex flex-col lg:flex-row gap-8">

            {/* Left Wall: Create Alert */}
            <div className="lg:w-1/3 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border-t-8 border-forest h-fit">
                <h2 className="font-display text-2xl font-bold text-forest mb-6 flex items-center gap-2">
                    <BellPlus className="w-6 h-6 text-harvest" />
                    Create Alert
                </h2>

                <form onSubmit={handleCreateAlert} className="space-y-6">
                    <div>
                        <label className="block text-forest font-bold mb-2 text-sm font-body">Crop</label>
                        <select
                            name="crop" required value={formData.crop} onChange={handleChange}
                            className="w-full bg-cream border-2 border-olive rounded-xl px-4 py-3 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:outline-none appearance-none"
                        >
                            <option value="">-- Choose Crop --</option>
                            {crops.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-forest font-bold mb-2 text-sm font-body">Condition</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`
                flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-bold transition-all
                ${formData.condition === "above" ? "bg-rust/10 border-rust text-rust" : "border-cream bg-white text-gray-500 hover:bg-cream"}
              `}>
                                <input type="radio" name="condition" value="above" checked={formData.condition === "above"} onChange={handleChange} className="hidden" />
                                Price Above
                            </label>
                            <label className={`
                flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-bold transition-all
                ${formData.condition === "below" ? "bg-olive/10 border-olive text-olive" : "border-cream bg-white text-gray-500 hover:bg-cream"}
              `}>
                                <input type="radio" name="condition" value="below" checked={formData.condition === "below"} onChange={handleChange} className="hidden" />
                                Price Below
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-forest font-bold mb-2 text-sm font-body">Target Price (₹)</label>
                        <input
                            type="number" name="targetPrice" required min="1" value={formData.targetPrice} onChange={handleChange}
                            className="w-full bg-cream border-2 border-olive rounded-xl px-4 py-3 font-mono font-bold text-harvest text-lg focus:ring-4 focus:ring-harvest/20 focus:outline-none"
                            placeholder="e.g. 2500"
                        />
                    </div>

                    <button type="submit" className="w-full bg-forest text-cream font-bold py-4 rounded-xl hover:bg-harvest transition-colors mt-2 shadow-md">
                        Set Alert
                    </button>
                </form>
            </div>

            {/* Right Wall: Active Alerts */}
            <div className="lg:w-2/3">
                <h2 className="font-display text-2xl font-bold text-forest mb-6">Active Alerts</h2>

                {alerts.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border-dashed border-2 border-olive/30 text-gray-400 font-body">
                        You don't have any active price alerts yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {alerts.map((alert) => (
                            <div key={alert.id} className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 flex flex-col gap-4 transition-transform hover:-translate-y-1 ${alert.condition === "above" ? "border-rust" : "border-olive"
                                }`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-display text-lg font-bold text-forest">{alert.crop}</h4>
                                        <span className={`px-2 py-0.5 mt-1 rounded text-xs font-bold inline-block ${alert.status === "triggered" ? "bg-rust/20 text-rust animate-pulse" : "bg-harvest/20 text-harvest"
                                            }`}>
                                            {alert.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <button onClick={() => handleDelete(alert.id)} className="p-2 text-gray-400 hover:text-rust hover:bg-rust/10 rounded-lg transition">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="bg-cream rounded-xl p-3 flex items-center justify-between">
                                    <div className="text-sm font-body text-gray-500">
                                        Notify when price goes
                                        <span className={`block font-bold ${alert.condition === "above" ? "text-rust" : "text-olive"}`}>
                                            {alert.condition.toUpperCase()} target
                                        </span>
                                    </div>
                                    <div className="font-mono text-2xl font-bold text-forest">
                                        ₹{alert.targetPrice}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Alerts;
