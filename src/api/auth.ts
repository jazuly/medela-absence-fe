import type { loginInterface } from "@/interface";
import { api } from "./client";

export const login = (data: loginInterface) =>
  api.post("/auth/login", data);
