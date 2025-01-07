export interface Comment {
  id: number;
  post_id: number;
  post_title: string;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
}

export interface CommentReq {
  content: string;
}
