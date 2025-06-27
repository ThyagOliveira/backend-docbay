export interface IGitHubUser {
  id: number;
  login: string;
  name: string;
  email?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  url?: string;
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
