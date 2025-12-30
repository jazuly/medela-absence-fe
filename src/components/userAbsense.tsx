import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { AbsenseInterface, UserInterface } from "@/interface";
import { useUser } from "@/hooks/useUser";
import { useAbsense } from "@/hooks/useAbsense";

export default function UserAbsensePage() {
  const { userId } = useParams<{ userId: string }>();
  const [isInit, setInit] = React.useState<boolean>(true);
  const [isInitUser, setInitUser] = React.useState<boolean>(true);
  const [isLoadByDate, setLoadByDate] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserInterface | null>(null);
  const [absense, setAbsense] = React.useState<AbsenseInterface[] | []>([]);
  const userStorage = JSON.parse(localStorage.getItem("user") || "");
  const { detailUser } = useUser();
  const { listAbsenseUser, absenseUser, error: absError } = useAbsense();
  const isAdmin = localStorage.getItem("isAdmin");
  const idUser = userId ?? userStorage.id
  if (!user) {
    setUser(userStorage);
  }
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = React.useState<string>(
    formatDate(firstOfMonth)
  );
  const [endDate, setEndDate] = React.useState<string>(formatDate(today));
  const navigate = useNavigate();

  const fetchUser = React.useCallback(async () => {
    if (!idUser) return;

    if (isInitUser) {
      const data = await detailUser(idUser);
      setUser(data);
      setInitUser(false);
    }
  }, [detailUser, idUser, isInitUser]);

  const fetchAbsense = React.useCallback(async () => {
    if (!idUser) return;

    if (isInit || isLoadByDate) {
      const query = new URLSearchParams({ startDate, endDate });
      const data = await listAbsenseUser(idUser, query.toString());

      if (!absError) {
        setAbsense(data);
      }

      setInit(false);
      setLoadByDate(false);
    }
  }, [
    idUser,
    startDate,
    endDate,
    absError,
    listAbsenseUser,
    isInit,
    isLoadByDate,
  ]);

  React.useEffect(() => {
    fetchAbsense();
  }, [fetchAbsense, startDate, endDate]);

  React.useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [fetchUser, userId]);

  const handleAbsence = async () => {
    await absenseUser(idUser);
    if (!absError) {
      setInit(true);
      setInitUser(true);
      await fetchUser();
      fetchAbsense();
    }
  };

  const formatTime = (isoString: string | null) =>
    isoString ? new Date(isoString).toLocaleString() : "—";
  const formatDuration = (login: string, logout: string | null) => {
    if (!logout) return "-";

    const start = new Date(login).getTime();
    const end = new Date(logout).getTime();

    const diffMs = end - start;
    if (diffMs <= 0) return "-";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (!user) return <p>Loading...</p>;

  const currentAbsense = user.absenses.length > 0 ? user.absenses[0] : null;
  const isDoneAbsense = !!(currentAbsense && currentAbsense.logout);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              <span>{user.nama}'s Absense</span>
              {isAdmin !== "true" && (
                <Button
                  className="mr-2"
                  variant="default"
                  onClick={() => navigate(`/${user.id}/profile`)}
                >
                  Profile
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <Avatar className="w-28 h-28">
            <AvatarImage
              src={`${import.meta.env.VITE_S3_URL}/${user.foto}`}
              alt="User Avatar"
            />
            <AvatarFallback>{user.nama.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex space-x-6">
            <div className="flex flex-col items-center text-sm">
              <span className="font-semibold">Check In</span>
              <span>{formatTime(currentAbsense?.login || null)}</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <span className="font-semibold">Check Out</span>
              <span>{formatTime(currentAbsense?.logout || null)}</span>
            </div>
          </div>
          {isAdmin !== "true" && (
            <Button
              size="lg"
              variant="default"
              disabled={isDoneAbsense}
              onClick={handleAbsence}
            >
              {isDoneAbsense
                ? "Absense"
                : currentAbsense
                ? "Check Out"
                : "Check In"}
            </Button>
          )}

          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Absense History</h3>
              <div className="flex space-x-2 items-center">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => (
                    setStartDate(e.target.value), setLoadByDate(true)
                  )}
                />
                <span> - </span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => (
                    setEndDate(e.target.value), setLoadByDate(true)
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {absense.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        No absense found
                      </TableCell>
                    </TableRow>
                  ) : (
                    absense.map((user) => {
                      return (
                        <React.Fragment key={user.id}>
                          <TableRow>
                            <TableCell>
                              {new Date(user.login).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {user.logout
                                ? new Date(user.logout).toLocaleString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {formatDuration(user.login, user.logout)}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="w-full flex justify-end">
            {isAdmin !== "true" ? (
              <Button variant="destructive" onClick={() => navigate("/login")}>
                Logout
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/")}>
                Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
