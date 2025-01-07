import { config } from '../config';

export const deletePostService = async (postID: number) => {
  const res = await fetch(`${config.apiUrl}/protected/posts/${postID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) {
    console.warn(await res.text());
    throw new Error('unable to delete post');
  }
};
