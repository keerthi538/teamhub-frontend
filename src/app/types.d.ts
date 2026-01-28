export enum Role {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}

export type Team = {
  id: number;
  name: string;
};

export type Document = {
  id: number;
  title: string;
  content?: string;
  teamId: number;
  authorId?: number;
  authorName?: string;
};

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: Role;
};
