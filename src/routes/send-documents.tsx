import { SendDocumentsPage } from "@/pages/SendDocumentsPage";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";

export const sendDocumentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/envio',
  component: SendDocumentsPage,
})