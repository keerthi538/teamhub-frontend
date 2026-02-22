import apiClient from "@/lib/axios";

export const getMe = async () => {
  const response = await apiClient.get("/users/me", {
    withCredentials: true,
  });

  const { id, name, email, memberships, currentTeam } = response.data;
  const teams = memberships.map((m: any) => m.team);

  return {
    id,
    name,
    email,
    teams,
    currentTeam,
  };
};

export const createTeam = async (teamName: string) => {
  const response = await apiClient.post(
    "/teams/create",
    { teamName },
    { withCredentials: true },
  );
  return response.data;
};
