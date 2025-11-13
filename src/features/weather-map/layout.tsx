import { Outlet } from "@tanstack/react-router";
import { MapContainer } from "react-leaflet";
import { MapCanvas } from "./components/map-canvas";
import { SearchInput } from "./components/search-input";
import { StormSelector } from "./components/storm-selector";
import { TimelineControl } from "./components/timeline-control";
import { WeatherSidebar } from "./components/weather-sidebar";
import { useWeatherMapStore } from "./store";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

function WeatherMapLayoutContent() {
  const { selectedStation, mapCenter, mapZoom, setIsMobileSidebarOpen } =
    useWeatherMapStore();

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <MapCanvas />
          <Outlet />
        </MapContainer>
      </div>
      <div className="absolute top-4 left-4 z-20 md:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-md"
        >
          <Icon path={mdiMenu} size={1.2} className="text-black" />
        </button>
      </div>

      <div
        className="absolute top-4 left-[4.5rem] right-4    
                     md:w-auto md:top-6 md:left-6 md:right-auto 
                     pointer-events-auto"
      >
        <SearchInput />
      </div>

      <div className="pointer-events-auto">
        <WeatherSidebar />
      </div>

      <StormSelector />

      <div
        className={`
    absolute bottom-4 z-20 transition-all duration-500 ease-in-out

    left-1/2 -translate-x-1/2 w-full max-w-xl px-2

    md:left-0 md:w-auto md:translate-x-0 md:px-0 md:max-w-none 
    ${selectedStation ? "md:right-[476px]" : "md:right-0"}
  `}
      >
        <TimelineControl />
      </div>
    </div>
  );
}

export function WeatherMapLayout() {
  return <WeatherMapLayoutContent />;
}
