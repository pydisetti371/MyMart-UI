import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  createAccount,
  restoreSession,
  saveSession,
  verifyCredentials,
  type AuthUser,
} from "./auth";

type AuthContextValue = {
  isReady: boolean;
  user: AuthUser | null;
  signIn: (phone: string, password: string) => Promise<void>;
  signUp: (name: string, phone: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      setUser(restoreSession());
    } finally {
      setIsReady(true);
    }
  }, []);

  const signIn = useCallback(async (phone: string, password: string) => {
    const signedInUser = await verifyCredentials(phone, password);
    saveSession(signedInUser.phone);
    setUser(signedInUser);
  }, []);

  const signUp = useCallback(
    async (name: string, phone: string, password: string) => {
      const newUser = await createAccount(name, phone, password);
      saveSession(newUser.phone);
      setUser(newUser);
    },
    [],
  );

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ isReady, user, signIn, signUp, signOut }),
    [isReady, user, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used within an AuthProvider.");
  return auth;
}
