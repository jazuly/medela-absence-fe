import type { AbsenseInterface } from "./absense";

export interface updateUserInterface {
  noHp: string;
  password: string;
  foto: File | null;
}

export interface UserInterface {
  id: string;
  nama: string;
  email: string;
  foto: string;
  posisi: string;
  noHp: string;
  absenses: AbsenseInterface[];
}

export interface CreateUserInterface {
  nama: string;
  email: string;
  posisi: string;
  noHp: string;
  foto: File | null;
  password: string;
}
