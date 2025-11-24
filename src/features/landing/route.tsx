import { createRoute, Navigate } from "@tanstack/react-router";
import { rootRoute } from "../../app/router";

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/weather-map" />,
});

export const landingRouteHierarchy = landingRoute.addChildren([]);
