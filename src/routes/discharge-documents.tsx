import { DischargeDocumentsPage } from "@/pages/DischargeDocumentsPage";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";

export const dischageDocumentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/baixa',
  component: DischargeDocumentsPage,
});