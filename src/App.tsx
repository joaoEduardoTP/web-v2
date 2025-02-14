import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Router } from "./router";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';



// function AppContent() {

//   useEffect(() => {
//     Cookies.set("auth_token", TOKEN.token, { expires: 1 });
//   }, []);



//   const { user, initializeAuth,  } = useAuthStore();
//   const { isLoading, isError } = useQuery({ queryKey: ["auth"], queryFn: initializeAuth });
//   const location = useLocation();


//   if (isLoading) {
//     return <div>Carregando...</div>;
//   }

//   if (isError) {
//     // window.location.href = "https://portal.transpanorama.com.br/";
//     return <Outlet />;
//   }

//   if (!user && location.pathname !== "/login") {
//     // window.location.href = "https://portal.transpanorama.com.br/";
//   }

//   return user ? (
//     <Layout>
//       <Outlet />
//     </Layout>
//   ) : (
//     <Layout>
//       <Outlet />
//     </Layout >
//   );
// }

// function App() {
//   return (

//       <Suspense fallback={ <PageSkeleton /> }>
//         <AppContent />
//       </Suspense>
//   );
// }

// export default App;

function App() {
  useEffect(() => {
    const PORTAL = import.meta.env.VITE_PORTAL_URL;
    console.log('PORTAL URL', PORTAL);
    const getToken = async () => {

      const response = axios.post(`${ PORTAL }/crete_access_token`, {
        email: "joao.eduardo@transpanorama.com.br",
        password: "e46b4a15ff3155d336deY{!A#"
      });

      const token = (await response).data.access_token;
      Cookies.set("access_token_cookie",
        token
        , { expires: 1 });
    };

    getToken();
  }, []);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
      },
    },
  });

  return (
    <QueryClientProvider client={ queryClient } >
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={ false } />
    </QueryClientProvider >
  );
}

export default App;