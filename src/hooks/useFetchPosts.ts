import { useEffect, useState } from 'react';
import { config } from '../config';
import { Post } from '../interfaces/post';

interface FetchPostsArgs {
  page?: number | null;
  limit?: number | null;
  subforumID?: number | null;
  userID?: number | null;
  countryID?: number | null; //can be changed to countryIDs, if have more advanced search function in the future
}

export function useFetchPosts({
  page = null,
  limit = null,
  subforumID = null,
  userID = null,
  countryID = null,
}: FetchPostsArgs) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: string[] = [];
        if (page) {
          params.push(`page=${page}`);
        }
        if (limit) {
          params.push(`limit=${limit}`);
        }
        if (subforumID) {
          params.push(`subforum_id=${subforumID}`);
        }
        if (userID) {
          params.push(`user_id=${userID}`);
        }
        if (countryID) {
          params.push(`country_ids=${countryID}`);
        }
        const urlparams = params.length > 0 ? `?${params.join('&')}` : '';
        const res = await fetch(`${config.apiUrl}/posts` + urlparams);
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        setPosts(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [countryID, subforumID, page]);

  return { posts, loading, error };
}
