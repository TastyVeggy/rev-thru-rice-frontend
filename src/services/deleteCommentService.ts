import { config } from '../config';

export const deleteCommentService = async (commentID: number) => {
  const res = await fetch(`${config.apiUrl}/protected/comments/${commentID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) {
    console.warn(await res.text());
    throw new Error('unable to delete comment');
  }
};
