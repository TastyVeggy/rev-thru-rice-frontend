import { useEffect, useState } from 'react';
import { config } from '../config';

interface SubforumsWithPostCount {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  post_count: number;
  country_id: number;
}

export function useFetchSubforumsWithPostCountByCountry(
  countryID: string | null
) {
  // will only find post counts for subforums with post count greater than 0
  const [subforumsWithPostCount, setSubforumsWithPostCount] = useState<
    SubforumsWithPostCount[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubforumsWithPostCount = async () => {
      setLoading(true);
      setError(null);
      try {
        const paramUrl = countryID ? `?country_id=${countryID}` : '';
        const res = await fetch(
          `${config.apiUrl}/subforums_with_post_count${paramUrl}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch subforums with post count');
        }
        const data = await res.json();
        console.log(data);
        setSubforumsWithPostCount(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSubforumsWithPostCount();
  }, [countryID]);

  return { subforumsWithPostCount, loading, error };
}
