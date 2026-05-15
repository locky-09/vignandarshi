"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { CloudRain, MapPin, Thermometer, Droplets, Wind, Loader2 } from "lucide-react";
import Link from "next/link";

type WeatherResponse = {
    location: string;
    condition: string;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    high: number;
    low: number;
    precipitation: number;
};

export default function WeatherPage() {
    const [location, setLocation] = useState("Austin, Texas");
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async (query: string) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/weather?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to fetch weather data.");
            }

            setWeather(data);
            setLocation(data.location);
        } catch (err: any) {
            setWeather(null);
            setError(err.message || "Weather service unavailable.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather(location);
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!location.trim()) return;
        await fetchWeather(location.trim());
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 space-y-8 min-h-screen">
            <Link href="/community" className="text-forest-500 font-medium mb-4 flex items-center hover:text-forest-700 transition">&larr; Back to Community</Link>

            <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 grid gap-4 md:grid-cols-[1fr_auto] items-end">
                <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-forest-700 mb-2">Enter your city or location</label>
                    <input
                        id="location"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        className="w-full rounded-3xl border border-forest-200 bg-white px-4 py-3 shadow-sm focus:border-forest-500 focus:outline-none"
                        placeholder="Example: Austin, Texas"
                    />
                    <p className="text-sm text-forest-500 mt-2">Search by city, state, or region for accurate plant-care weather recommendations.</p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 rounded-3xl bg-forest-900 text-white px-6 font-semibold shadow-lg shadow-forest-900/20 hover:bg-forest-800 transition-colors disabled:opacity-60"
                >
                    {isLoading ? "Loading..." : "Get Weather"}
                </button>
            </form>

            {error ? (
                <div className="glass-card rounded-3xl p-6 bg-rose-50 border border-rose-200 text-rose-700">
                    <p className="font-semibold">{error}</p>
                </div>
            ) : null}

            <div className="flex flex-col md:flex-row justify-between items-center bg-blue-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 blur-3xl rounded-full translate-x-1/3"></div>
                <div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-2"><MapPin /> {weather?.location || "Austin, Texas"}</h1>
                    <p className="text-blue-200">{weather ? "Real-time macroclimate sync active." : "Search for a location to load weather."}</p>
                </div>
                <div className="text-right mt-6 md:mt-0">
                    {isLoading ? (
                        <Loader2 className="animate-spin mx-auto" size={48} />
                    ) : (
                        <>
                            <h2 className="text-6xl font-black">{weather ? `${weather.temp}°` : "--"}</h2>
                            <p className="font-semibold text-blue-200">{weather?.condition || "Clear Skies"}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
                    <Thermometer className="text-orange-500 mb-3" size={32} />
                    <p className="text-forest-600 text-sm font-semibold uppercase">High / Low</p>
                    <p className="text-2xl font-bold text-forest-900 mt-1">{weather ? `${weather.high}° / ${weather.low}°` : "--"}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
                    <Droplets className="text-blue-500 mb-3" size={32} />
                    <p className="text-forest-600 text-sm font-semibold uppercase">Humidity</p>
                    <p className="text-2xl font-bold text-forest-900 mt-1">{weather ? `${weather.humidity}%` : "--"}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
                    <CloudRain className="text-cyan-500 mb-3" size={32} />
                    <p className="text-forest-600 text-sm font-semibold uppercase">Precipitation</p>
                    <p className="text-2xl font-bold text-forest-900 mt-1">{weather ? `${weather.precipitation} in` : "--"}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
                    <Wind className="text-slate-500 mb-3" size={32} />
                    <p className="text-forest-600 text-sm font-semibold uppercase">Wind Speed</p>
                    <p className="text-2xl font-bold text-forest-900 mt-1">{weather ? `${weather.wind_speed} mph` : "--"}</p>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-forest-900 mb-4 border-b border-forest-100 pb-4">Smart Adjustments</h2>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-forest-600 text-sm">
                        This tool now fetches live weather from your chosen city. Use the location search box to sync plant care recommendations to your local conditions.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
