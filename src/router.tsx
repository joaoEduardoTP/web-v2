
// import { envelopesRoute } from './routes/envelopes';
// import { usersRoute } from './routes/users';
// import { receiptRoute } from './routes/receipt';
// import { sentDocumentsRoute } from './routes/sent-documents';
// import { travelDocumentsRoute } from './routes/travel-documents';
// import { monitoringRoute } from './routes/monitoring';
// import { notFoundRoute } from './routes/not-found';

import { RouterProvider, createRouter } from "@tanstack/react-router";

import { dashboardRoute } from "./routes/dashboard";
import { dischageDocumentRoute } from "./routes/discharge-documents";
import { rootRoute } from "./routes/root";
import { sendDocumentsRoute } from "./routes/send-documents";
import { travelDocumentsRoute } from "./routes/travel-documents";
import { monitoringRoute } from "./routes/monitoring";


const routeTree = rootRoute.addChildren([
  dashboardRoute,
  travelDocumentsRoute,
  sendDocumentsRoute,
  dischageDocumentRoute,
  monitoringRoute,
]);


const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});


declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function Router() {
  return <RouterProvider router={ router } />;
};