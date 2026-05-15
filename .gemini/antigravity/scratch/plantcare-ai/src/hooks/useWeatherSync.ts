import { useState, useEffect } from "react";

type WeatherData = {
    temp: number;
    humidity: number;
    location: string;
    condition: string;
};

export function useWeatherSync() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadLocalWeather() {
            setIsLoading(true);

            try {
                const getPosition = () =>
                    new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: false,
                            timeout: 10000,
                            maximumAge: 10000,
                        });
                    });

                const position = await getPosition();
                const response = await fetch(
                    `/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
                );

                if (!response.ok) throw new Error("Unable to fetch local weather.");

                const data = await response.json();
                setWeatherData({
                    temp: data.temp,
                    humidity: data.humidity,
                    location: data.location,
                    condition: data.condition,
                });
            } catch {
                try {
                    const fallback = await fetch(`/api/weather?q=San Francisco, CA`);
                    const fallbackData = await fallback.json();

                    if (!fallback.ok) throw new Error("Fallback weather unavailable.");

                    setWeatherData({
                        temp: fallbackData.temp,
                        humidity: fallbackData.humidity,
                        location: fallbackData.location,
                        condition: fallbackData.condition,
                    });
                } catch {
                    setWeatherData(null);
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadLocalWeather();
    }, []);

    return { weatherData, isLoading };
}
