import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditorPage from "./components/EditorPage";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./common/AppLayout";
import TeamMembers from "./pages/TeamMembers";

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
        path: "team",
        element: <TeamMembers />,
      },
      {
        path: "teams/:teamId/documents/:documentId",
        element: <EditorPage />,
      },
    ],
  },
];
