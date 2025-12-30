import { login } from "@/api/auth";
import type { loginInterface } from "@/interface";
import { useState } from "react";
import { toast } from "sonner";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (payload: loginInterface) => {
    setLoading(true);
    try {
      const { data } = await login(payload);
      localStorage.setItem("token", data.data);
    } catch (error: any) {
      const err = error?.response?.data?.error || error.message;
      setError(err);
      toast.error(err);
      throw err;
    } finally {
      setError(null);
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
}
