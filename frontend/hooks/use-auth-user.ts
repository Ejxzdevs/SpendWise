import { useEffect, useState } from "react";
import { getUserInfo } from "@/utils/authStorage";
import { AuthUser } from "@/types/auth";

export const useAuthUser = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfoString = await getUserInfo();
        if (!userInfoString) return;

        const parsed = JSON.parse(userInfoString);
        // for debugging
        // console.log("Loaded auth user:", parsed);

        setUser({
          user_id: parsed.user_id,
          username: parsed.username,
        });
      } catch (e) {
        console.error("Failed to load auth user", e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
};
