import { NotFoundPage } from "@/pages/NotFoundPage";
import { useAuthStore } from "@/store/authStore";
import { createRootRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react"; // Ou outro componente de loading
import { useEffect } from "react";
import { Layout } from "../components/Layout";

function RootComponent() {
  const { user, initializeAuth, isLoading, } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }


  return user ? (
    <Layout/>
  ) : (
    <NotFoundPage />
  );
}

export const rootRoute = createRootRoute({
  component: () => <RootComponent />,

  notFoundComponent: () => <NotFoundPage />,
});