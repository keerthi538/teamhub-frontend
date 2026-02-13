import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { routes } from "./routes";
import { useEffect } from "react";

function renderRoutes(routes: any[]) {
  return routes.map(({ path, element, children, index }) => (
    <Route key={path ?? "index"} path={path} index={index} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate, location]);

  return <Routes>{renderRoutes(routes)}</Routes>;
}
