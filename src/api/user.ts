import type { CreateUserInterface, updateUserInterface } from "@/interface";
import { api } from "./client";

export const list = () => api.get("/user");
export const profile = () => api.get("/user/profile");
export const detail = (id: string) => api.get(`/user/${id}`);
export const update = (id: string, payload: updateUserInterface) => {
  const formData = new FormData();
  formData.append("noHp", payload.noHp);
  formData.append("password", payload.password);

  if (payload.foto) {
    formData.append("foto", payload.foto);
  }

  return api.put(`/user/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const create = (payload: CreateUserInterface) => {
  const formData = new FormData();
  formData.append("nama", payload.nama);
  formData.append("email", payload.email);
  formData.append("posisi", payload.posisi);
  formData.append("noHp", payload.noHp);
  formData.append("password", payload.password);

  if (payload.foto) {
    formData.append("foto", payload.foto);
  }

  return api.post("/user", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
