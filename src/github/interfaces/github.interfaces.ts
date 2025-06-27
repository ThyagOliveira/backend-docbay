import { User } from '@prisma/client';

export interface IGitHubUser {
  id: number;
  login: string;
  name: string;
  email?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  html_url?: string;
  blog?: string;
}

export interface IUserPayload {
  name: string;
  email?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  url?: string;
  blog?: string;
  languages: string[];
}

interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  prev: number | null;
  next: number | null;
}

export interface PaginatedUsers {
  data: User[];
  meta: PaginationMeta;
}
