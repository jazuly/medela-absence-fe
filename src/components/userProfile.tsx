import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useParams, useNavigate } from "react-router-dom";
import React from "react";

interface Absense {
  id: string;
  login: string;
  logout: string | null;
  userId: string;
}

interface User {
  id: string;
  nama: string;
  email: string;
  foto: string;
  posisi: string;
  noHp: string;
  absenses: Absense[];
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = React.useState<User | null>(null);
  //   const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [updateUser, setUpdateUser] = React.useState<{
    noHp: string;
    foto: File | null;
  }>({
    noHp: "",
    foto: null,
  });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  React.useEffect(() => {
    if (userId) {
      fetch(`${API_URL}/user/${userId}`)
        .then((res) => res.json())
        .then((response) => {
          setUser(response.data);
          setAvatarPreview(
            `${import.meta.env.VITE_S3_URL}/${response.data.foto}`
          );
          setUpdateUser({
            noHp: response.data.noHp,
            foto: null,
          });
        })
        .catch(console.error);
    }
  }, [userId, API_URL]);

  if (!user) return <p>Loading...</p>;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUpdateUser({ ...updateUser, foto: file })
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();
      formData.append("noHp", updateUser.noHp);

      if (updateUser.foto) {
        formData.append("foto", updateUser.foto);
      }

      const res = await fetch(`${API_URL}/user/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to add user");
      }

      await res.json();

      setUpdateUser({
        noHp: updateUser.noHp,
        foto: null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={avatarPreview || "/avatar.jpg"}
                  alt="User Avatar"
                />
                <AvatarFallback>{user.nama.charAt(0)}</AvatarFallback>
              </Avatar>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">Name</Label>
              <Input id="firstName" defaultValue={user.nama} disabled />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user.email} disabled />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={updateUser.noHp}
                onChange={(e) =>
                  setUpdateUser({ ...updateUser, noHp: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input id="position" defaultValue={user.posisi} disabled />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back
            </Button>
            <Button onClick={handleUpdateUser}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
