import { Outlet } from "react-router-dom";
import { selectUser } from "./store/userSlice";
import Navbar from "./components/Navbar";
import { useAppSelector } from "./store/hooks";
import "./App.css";

export default function AppLayout() {
  const { name, currentTeam, teams } = useAppSelector(selectUser);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f8ff] to-white">
      <Navbar
        userName={name}
        currentTeam={currentTeam ?? null}
        teams={teams ?? []}
      />
      <Outlet />
    </div>
  );
}
