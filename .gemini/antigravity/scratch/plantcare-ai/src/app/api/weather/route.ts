import { NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: Request) {
    if (!OPENWEATHER_API_KEY) {
        return NextResponse.json({ error: "Missing OpenWeather API key." }, { status: 500 });
    }

    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");

    if (!q && (!lat || !lon)) {
        return NextResponse.json({ error: "Please provide a location query or latitude/longitude." }, { status: 400 });
    }

    const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
    weatherUrl.searchParams.set("appid", OPENWEATHER_API_KEY);
    weatherUrl.searchParams.set("units", "imperial");

    if (q) {
        weatherUrl.searchParams.set("q", q);
    } else {
        weatherUrl.searchParams.set("lat", lat!);
        weatherUrl.searchParams.set("lon", lon!);
    }

    const apiResponse = await fetch(weatherUrl.toString());
    const payload = await apiResponse.json();

    if (!apiResponse.ok) {
        return NextResponse.json({ error: payload.message || "Unable to fetch weather data." }, { status: apiResponse.status });
    }

    const precipitation = payload.rain?.["1h"] ?? payload.snow?.["1h"] ?? 0;

    return NextResponse.json({
        location: `${payload.name}${payload.sys?.country ? `, ${payload.sys.country}` : ""}`,
        condition: payload.weather?.[0]?.description ?? "Unknown",
        temp: Math.round(payload.main.temp),
        feels_like: Math.round(payload.main.feels_like),
        humidity: payload.main.humidity,
        wind_speed: Math.round(payload.wind.speed),
        high: Math.round(payload.main.temp_max),
        low: Math.round(payload.main.temp_min),
        precipitation: Number(precipitation.toFixed(2)),
    });
}
