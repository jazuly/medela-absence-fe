import { list, absense } from "@/api/absense";
import { useState } from "react";
import { toast } from "sonner";

export function useAbsense() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listAbsenseUser = async (userId: string, query: string) => {
    setLoading(true);
    try {
      const { data } = await list(userId, query);
      return data.data;
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

  const absenseUser = async (userId: string) => {
    setLoading(true);
    try {
      const localUser = JSON.parse(localStorage.getItem("user") || "");
      const { data } = await absense(userId);

      if (localUser.absenses.length > 0) {
        localUser.absenses[0] = data.data;
      } else {
        localUser.absenses.push(data.data);
      }

      localStorage.setItem("user", JSON.stringify(localUser));
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

  return { listAbsenseUser, absenseUser, loading, error };
}
