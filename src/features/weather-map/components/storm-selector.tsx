import { stormsApi } from "@/services/apis/storms.api";
import { mdiChevronUp, mdiWeatherHurricaneOutline } from "@mdi/js";
import Icon from "@mdi/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useWeatherMapStore } from "../store";

export function StormSelector() {
  const {
    isStormSelectorOpen,
    setSelectedStormId,
    setStorms,
    storms,
    selectedStormId,
  } = useWeatherMapStore();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleStormClick = (stormId: number | null) => {
    setSelectedStormId(stormId);
    setIsCollapsed(true);
  };

  useEffect(() => {
    const fetchStorms = async () => {
      try {
        const response = await stormsApi.storms.list();
        const data = response.data.sort((a, b) => b.storm_id - a.storm_id);
        setStorms(data);
      } catch (error) {
        console.error("Error fetching storms:", error);
      }
    };

    fetchStorms();
  }, [setStorms]);

  if (!isStormSelectorOpen) {
    return null;
  }

  return (
    <div className="absolute top-20 right-4 md:top-6 md:right-6 z-20 pointer-events-auto w-[280px] md:w-[240px]">
      {" "}
      <div className="p-3 flex flex-col gap-2 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl transition-all duration-300">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex justify-between items-center w-full"
        >
          <span className="font-medium text-base text-black">Select Storm</span>
          <Icon
            path={mdiChevronUp}
            size={1}
            className={`text-black transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        {!isCollapsed && (
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[400px] md:max-h-[300px] mt-2">
            {storms.map((storm) => (
              <button
                key={storm.storm_id}
                onClick={() => handleStormClick(storm.storm_id)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  selectedStormId === storm.storm_id
                    ? "bg-orange-500 text-white"
                    : "bg-white/50 hover:bg-white/80 text-black"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon path={mdiWeatherHurricaneOutline} size={0.7} />
                  <h3 className="text-sm font-semibold">{storm.storm_name}</h3>
                </div>
                <div className="text-xs space-y-0.5 pl-1">
                  <p>
                    <span className="opacity-80">Start:</span>{" "}
                    <span className="font-medium">
                      {dayjs(storm.start_date).format("DD/MM/YYYY")}
                    </span>
                  </p>
                  <p>
                    <span className="opacity-80">End:</span>{" "}
                    <span className="font-medium">
                      {dayjs(storm.end_date).format("DD/MM/YYYY")}
                    </span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
