import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useWeatherMapStore } from "../store";

export function MapUpdater() {
  const { mapCenter, mapZoom } = useWeatherMapStore();
  const map = useMap();

  useEffect(() => {
    map.flyTo(mapCenter, mapZoom, {
      animate: true,
      duration: 1.5,
    });
  }, [mapCenter, mapZoom, map]);

  return null;
}
