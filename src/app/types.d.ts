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
