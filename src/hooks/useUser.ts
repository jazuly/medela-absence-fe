import { list, profile, detail, update, create } from "@/api/user";
import type { CreateUserInterface, updateUserInterface } from "@/interface";
import { useState } from "react";
import { toast } from "sonner";

export function useUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listUser = async () => {
    setLoading(true);
    try {
      const { data } = await list();
      return data.data
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

  const profileUser = async () => {
    setLoading(true);
    try {
      const { data } = await profile();
      localStorage.setItem("user", JSON.stringify(data.data));
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

  const detailUser = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await detail(id);
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

  const updateUser = async (id: string, payload: updateUserInterface) => {
    setLoading(true);
    try {
      const { data } = await update(id, payload);
      toast.success("profile updated");
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

  const createUser = async (payload: CreateUserInterface) => {
    setLoading(true);
    try {
      const { data } = await create(payload);
      toast.success("user created");
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

  return { listUser, profileUser, detailUser, updateUser, createUser, loading, error };
}
