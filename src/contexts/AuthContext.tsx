import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearAccessToken,
  clearUserProfile,
  getAccessToken,
  getUserProfile,
  saveUserProfile,
} from "../services/api";
import { login, LoginRequestDTO, LoginResponseDTO } from "../services/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  isRestoringSession: boolean;
  user: LoginResponseDTO["user"] | null;
  signIn: (credentials: LoginRequestDTO) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [user, setUser] = useState<LoginResponseDTO["user"] | null>(null);

  useEffect(() => {
    let isMounted = true;

    getAccessToken()
      .then(async (token) => {
        if (!isMounted) {
          return;
        }

        setIsAuthenticated(Boolean(token));
        if (token) {
          setUser(await getUserProfile());
        }
      })
      .catch((error: unknown) => {
        console.error("No se pudo restaurar la sesión:", error);
      })
      .finally(() => {
        if (isMounted) {
          setIsRestoringSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (credentials: LoginRequestDTO) => {
    const response = await login(credentials);
    await saveUserProfile(response.user);
    setUser(response.user);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    await clearAccessToken();
    await clearUserProfile();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isRestoringSession,
      user,
      signIn,
      signOut,
    }),
    [isAuthenticated, isRestoringSession, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
