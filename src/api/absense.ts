import { api } from "./client";

export const list = (id: string, query: string) => api.get(`/absence/${id}?${query}`);
export const absense = (id: string) => api.patch(`/absence/${id}`);