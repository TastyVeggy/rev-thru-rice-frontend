import { Comment, CommentReq } from './../interfaces/comment';
import { config } from '../config';

export const createCommentService = async (
  comment: CommentReq,
  postID: number
) => {
  const res = await fetch(
    `${config.apiUrl}/protected/posts/${postID}/comments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
      credentials: 'include',
    }
  );
  if (!res.ok) {
    console.warn(await res.text());
    throw new Error('unable to create comment');
  }
  const data = await res.json();
  return data.comment as Comment;
};
