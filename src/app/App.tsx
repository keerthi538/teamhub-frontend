import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";

function renderRoutes(routes: any[]) {
  return routes.map(({ path, element, children, index }) => (
    <Route
      key={path ?? "index"}
      path={path}
      index={index}
      element={element}
    >
      {children && renderRoutes(children)}
    </Route>
  ));
}

export default function App() {
  return <Routes>{renderRoutes(routes)}</Routes>;
}
