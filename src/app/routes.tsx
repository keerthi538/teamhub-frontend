import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditorPage from "./components/EditorPage";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./common/AppLayout";

export const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "teams/:teamId/documents/:documentId",
        element: <EditorPage />,
      },
    ],
  },
];
