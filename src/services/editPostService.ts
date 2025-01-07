import { config } from '../config';
import { Post, PostReq } from '../interfaces/post';

export const editPostService = async (post: PostReq, postID: number) => {
  const res = await fetch(`${config.apiUrl}/protected/posts/${postID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
    credentials: 'include',
  });
  if (!res.ok) {
    console.warn(await res.text());
    throw new Error('unable to edit post');
  }
  const data = await res.json();
  return data.post as Post;
};
