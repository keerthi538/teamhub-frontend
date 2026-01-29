import axios from "axios";

export const getMe = async () => {
  const response = await axios.get("http://localhost:3000/users/me", {
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
