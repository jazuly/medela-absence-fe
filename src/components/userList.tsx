import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CreateUserInterface, UserInterface } from "@/interface";
import { useUser } from "@/hooks/useUser";

export default function UserList() {
  const [isInit, setInit] = React.useState<boolean>(true);
  const { listUser, createUser, error, loading } = useUser();
  const [users, setUsers] = React.useState<UserInterface[]>([]);
  const [open, setOpen] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [newUser, setNewUser] = React.useState<CreateUserInterface>({
    nama: "",
    email: "",
    posisi: "",
    noHp: "",
    foto: null,
    password: "",
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isInit) return;

    const fetchUsers = async () => {
      const data = await listUser()

      if (!error) {
        setUsers(data);
      }

      setInit(false)
    };

    fetchUsers();
  }, [listUser, error, isInit]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewUser({ ...newUser, foto: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAddUser = async () => {
    const data = await createUser(newUser);

    if (!error) {
      setUsers((prev) => [...prev, data]);
      setNewUser({
        nama: "",
        email: "",
        posisi: "",
        noHp: "",
        foto: null,
        password: '',
      });
      setOpen(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User List</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="flex justify-center mb-6">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={avatarPreview || "/avatar.jpg"}
                        alt="User Avatar"
                      />
                      <AvatarFallback>A</AvatarFallback>
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
                    <Input
                      id="firstName"
                      value={newUser.nama}
                      onChange={(e) =>
                        setNewUser({ ...newUser, nama: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newUser.noHp}
                      onChange={(e) =>
                        setNewUser({ ...newUser, noHp: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newUser.posisi}
                      onChange={(e) =>
                        setNewUser({ ...newUser, posisi: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      value={newUser.password}
                      type="password"
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button onClick={handleAddUser}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading users...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    return (
                      <React.Fragment key={user.id}>
                        {/* USER ROW */}
                        <TableRow>
                          <TableCell className="font-medium">
                            {user.nama}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.posisi}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/${user.id}/profile`)}
                            >
                              Profile
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => navigate(`/${user.id}/absense`)}
                            >
                              Absense
                            </Button>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
          <div className="w-full flex justify-end mt-3">
            <Button variant="destructive" onClick={() => navigate("/login")}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
