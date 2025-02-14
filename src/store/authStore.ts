import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DataPayload, Payload, User } from "@/types/jwt-payload";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";


type AuthState = {
  user: DataPayload | null;
  isLoading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  login: (decodedToken: Payload) => void;
  logout: () => void;
};



export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const PORTAL_URL = import.meta.env.VITE_PORTAL_URL;
          const token = Cookies.get("access_token_cookie");

          let attempts = 0;

          while (!token && attempts < 3) {
            console.log("Tentando obter token...");
            attempts++;
          }

          const userLoggedIn = jwtDecode(token as string).sub;

          console.log(token);

          const response = axios.get(`${ PORTAL_URL}/api/user/${ userLoggedIn }`, { headers: { Authorization: `Bearer ${ token }` } });
          const credentials = await response;
          const payload: Payload = credentials.data


          // Verifica se o token está expirado
          // if (decodedToken.exp * 1000 < Date.now()) {
          //   set({
          //     isLoading: false,
          //     error: "Token expirado.",
          //     user: null,
          //   });
          //   Cookies.remove("auth_token", { path: "/" });
          //   return;
          // }

          get().login(payload);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Erro ao autenticar.",
          });
        }
      },
      login: (payload: Payload) => {
        set({
          user: payload.data,
          isLoading: false,
          error: null,
        });
      },
      logout: () => {
        Cookies.remove("auth_token", { path: "/" });
        set({ user: null });
      }
    }),
    {
      name: "auth-storage",
    }
  )
);