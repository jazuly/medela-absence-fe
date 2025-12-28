import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Absense {
  id: string;
  login: string;
  logout: string | null;
  userId: string;
}

interface User {
  id: string;
  nama: string;
  foto: string;
  absenses: Absense[];
}

export default function UserAbsensePage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = React.useState<User | null>(null);
  const [absense, setAbsense] = React.useState<Absense[] | []>([]);
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = React.useState<string>(
    formatDate(firstOfMonth)
  );
  const [endDate, setEndDate] = React.useState<string>(formatDate(today));
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchUser = React.useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/user/${userId}`);
      const response = await res.json();
      setUser(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [userId, API_URL]);

  const fetchAbsense = React.useCallback(async () => {
    if (!userId) return;
    try {
        const query = new URLSearchParams({ startDate, endDate });
      const res = await fetch(`${API_URL}/absence/${userId}?${query.toString()}`);
      const response = await res.json();
      setAbsense(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [userId, API_URL, startDate, endDate]);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  React.useEffect(() => {
    if (startDate && endDate) {
      fetchAbsense();
    }
  }, [startDate, endDate, fetchAbsense]);

  const handleAbsence = async () => {
    try {
      const res = await fetch(`${API_URL}/absence/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to update absense");

      // re-fetch users to update UI
      fetchUser();
      fetchAbsense();
    } catch (err) {
      console.error("Absense error:", err);
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
          <CardTitle>{user.nama}'s Absense</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <Avatar className="w-28 h-28">
            <AvatarImage src={`${import.meta.env.VITE_S3_URL}/${user.foto}`} alt="User Avatar" />
            <AvatarFallback>{user.nama.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex space-x-6">
            <div className="flex flex-col items-center text-sm">
              <span className="font-semibold">Login</span>
              <span>{formatTime(currentAbsense?.login || null)}</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <span className="font-semibold">Logout</span>
              <span>{formatTime(currentAbsense?.logout || null)}</span>
            </div>
          </div>

          <Button
            size="lg"
            variant="default"
            disabled={isDoneAbsense}
            onClick={handleAbsence}
          >
            {isDoneAbsense ? "Absense" : currentAbsense ? "Logout" : "Login"}
          </Button>

          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Absense History</h3>
              <div className="flex space-x-2 items-center">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span> - </span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Login</TableHead>
                    <TableHead>Logout</TableHead>
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
                              {user.logout ? new Date(user.logout).toLocaleString() : '-'}
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
            <Button variant="outline" onClick={() => navigate("/")}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
