import { TravelDocumentsPage } from "@/pages/TravelDocumentsPage";
import { rootRoute } from "./root";
import { createRoute } from "@tanstack/react-router";

export const travelDocumentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entrega',
  component: TravelDocumentsPage,
});