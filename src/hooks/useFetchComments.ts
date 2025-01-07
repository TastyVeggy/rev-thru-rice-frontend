import { useEffect, useState } from 'react';
import { config } from '../config';
import { Comment } from '../interfaces/comment';

interface FetchCommentsArgs {
  limit?: number | null;
  page?: number | null;
  postID?: number | null;
  userID?: number | null;
}

export function useFetchComments({
  limit = null,
  page = null,
  postID = null,
  userID = null,
}: FetchCommentsArgs) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
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
        if (postID) {
          params.push(`post_id=${postID}`);
        }
        if (userID) {
          params.push(`user_id=${userID}`);
        }
        const urlparams = params.length > 0 ? `?${params.join('&')}` : '';
        const res = await fetch(`${config.apiUrl}/comments${urlparams}`);
        if (!res.ok) {
          throw new Error('Failed to fetch comments');
        }
        setComments(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [page]);

  return { comments, loading, error };
}
