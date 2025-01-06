import { useEffect, useState } from 'react';
import { config } from '../config';

interface FetchPostCountArgs {
  subforumID?: number | null;
  userID?: number | null;
  countryID?: number | null;
}

export function useFetchPostCount({
  subforumID = null,
  userID = null,
  countryID = null,
}: FetchPostCountArgs) {
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostCount = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: string[] = [];
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
        const res = await fetch(`${config.apiUrl}/posts/count` + urlparams);
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        setPostCount(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPostCount();
  }, [countryID]);

  return { postCount, loading, error };
}
