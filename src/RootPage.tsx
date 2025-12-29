import AbsensePage from "@/components/userAbsense";
import UserListPage from "@/components/userList";

const RootPage = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (isAdmin) {
    return <UserListPage />;
  }

  return <AbsensePage />;
};

export default RootPage;
