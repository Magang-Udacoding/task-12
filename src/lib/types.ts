import type { CategoryType, StatusType } from "./card-styles";

export type HelpRequest = {
  id: number;
  title: string;
  description: string;
  category: CategoryType;
  location: string;
  status: StatusType;
  user_id: string;
  contact: string | null;
  created_at: string;
};

export type HelpRequestInsert = {
  title: string;
  description: string;
  category: CategoryType;
  location: string;
  contact?: string | null;
  user_id: string;
  status: StatusType;
};
