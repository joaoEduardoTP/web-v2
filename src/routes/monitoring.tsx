import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import MonitoringPage from "@/pages/MonitoringPage";

export const monitoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/acompanhamento',
  component: MonitoringPage,

});