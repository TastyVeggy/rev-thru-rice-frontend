export interface Post {
  id: number;
  subforum_id: number;
  user_id: number;
  username: string;
  title: string;
  content: string;
  comment_count: number;
  created_at: string;
  countries: string[];
}

export interface PostReq {
  title: string;
  content: string;
  countries: string[];
}
