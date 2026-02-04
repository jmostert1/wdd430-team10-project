import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  seller: boolean;
  country: string;
  bio: string;
  avatar?: string;
};

export default function useAuthUser(options?: { redirectToLogin?: boolean }) {
  const router = useRouter();
  const redirectToLogin = options?.redirectToLogin ?? false;

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // no token
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      if (redirectToLogin) router.push("/login");
      return;
    }

    fetch("/api/auth/user", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          if (redirectToLogin) router.push("/login");
          return;
        }

        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
        if (redirectToLogin) router.push("/login");
      })
      .finally(() => setLoadingUser(false));
  }, [router, redirectToLogin]);

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return {
    user,
    loadingUser,
    isLoggedIn: !!user,
    signOut,
  };
}
