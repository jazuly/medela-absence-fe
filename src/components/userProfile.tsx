import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { useUser } from "@/hooks/useUser";
import type { UserInterface } from "@/interface";

export default function ProfilePage() {
  const [isInit, setInit] = React.useState<boolean>(true);
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = React.useState<UserInterface | null>(null);
  //   const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const { detailUser, updateUser: updateUserApi, error, loading } = useUser();
  const [updateUser, setUpdateUser] = React.useState<{
    noHp: string;
    password: string;
    foto: File | null;
  }>({
    noHp: "",
    password: "",
    foto: null,
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userId || !isInit) return;

    const fetchUser = async () => {
      const data = await detailUser(userId);

      if (!error) {
        setUser(data);
        setAvatarPreview(`${import.meta.env.VITE_S3_URL}/${data.foto}`);
        setUpdateUser({
          noHp: data.noHp,
          password: "",
          foto: null,
        });
      }

      setInit(false);
    };

    fetchUser();
  }, [detailUser, userId, error, isInit]);

  if (!user) return <p>Loading...</p>;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUpdateUser({ ...updateUser, foto: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateUser = async () => {
    try {
      updateUserApi(userId as string, {
        noHp: updateUser.noHp,
        password: updateUser.password,
        foto: updateUser.foto,
      });

      setUpdateUser({
        noHp: updateUser.noHp,
        password: "",
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

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={updateUser.password}
                onChange={(e) =>
                  setUpdateUser({ ...updateUser, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => navigate("/")}
            >
              Back
            </Button>
            <Button disabled={loading} onClick={handleUpdateUser}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
