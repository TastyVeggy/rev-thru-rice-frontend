import { config } from '../config';
import { Post, PostReq } from '../interfaces/post';

export const createPostService = async (post: PostReq, subforum_id: string) => {
  const res = await fetch(
    `${config.apiUrl}/protected/subforums/${subforum_id}/posts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
      credentials: 'include',
    }
  );
  if (!res.ok) {
    console.warn(await res.text());
    throw new Error('unable to create post');
  }
  const data = await res.json();
  return data.post as Post;
};
