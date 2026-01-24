import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch } from "./store/hooks";
import { setCurrentUser } from "./store/userSlice";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/me", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setAuthenticated(true);

          const { id, name, email, memberships } = response.data;
          const teams = memberships.map((m: any) => m.team);
          const userData = {
            id,
            name,
            email,
            teams,
            currentTeam: teams[0] || null,
          };

          dispatch(setCurrentUser(userData));
        } else {
          setAuthenticated(false);
        }
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Checking session...</p>;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
