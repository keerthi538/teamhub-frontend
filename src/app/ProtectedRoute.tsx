import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchMe, selectUser } from "./store/userSlice";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const dispatch = useAppDispatch();
  const { status, isAuthenticated } = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(fetchMe());
  }, []);

  if (status === "loading" || status === "idle")
    return <p>Checking session...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
