import { config } from '../config';
import { Comment, CommentReq } from '../interfaces/comment';

export const editCommentService = async (
  comment: CommentReq,
  commentID: number
) => {
  const res = await fetch(`${config.apiUrl}/protected/comments/${commentID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
    credentials: 'include',
  });
  if (!res.ok) {
    console.warn(await res.text());
    throw new Error('unable to edit comment');
  }
  const data = await res.json();
  return data.comment as Comment;
};
