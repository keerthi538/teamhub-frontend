import Login from "./pages/Login";
import Dashboard from "./pages/Documents";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./common/AppLayout";
import TeamMembers from "./pages/TeamMembers";
import EditorPage from "./pages/EditorPage";
import SignUp from "./pages/Signup";

export const routes = [
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
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
