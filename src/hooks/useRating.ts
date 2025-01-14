import { useEffect, useState } from 'react';
import { config } from '../config';
import { Rating, Shop } from '../interfaces/review';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

interface ratingProps {
  shop: Shop | null;
  newRatingScore: number;
  canMutateRating: boolean;
}

export function useRating({
  shop,
  newRatingScore,
  canMutateRating,
}: ratingProps) {
  // rating is the state that is synchronised with the server
  const [initialRatingScore, setInitialRatingScore] = useState<number>(0);
  const [debouncedRatingScore, setDebouncedRatingScore] = useState<number>(0);
  const [rating, setRating] = useState<Rating | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [hasFetchedInitialRating, setHasFetchedInitialRating] = useState(false);

  // fetch rating once and only once if authenticated and shop fetched properly
  useEffect(() => {
    const fetchRating = async () => {
      if (shop && isAuthenticated && !hasFetchedInitialRating) {
        try {
          const ratingRes = await fetch(
            `${config.apiUrl}/protected/shops/${shop.id}/ratings`,
            {
              credentials: 'include',
            }
          );
          if (!ratingRes.ok) {
            const fetchErr = await ratingRes.text();
            if (fetchErr === 'Rating not found') {
              setInitialRatingScore(0);
              setDebouncedRatingScore(0);
              setHasFetchedInitialRating(true);
            } else {
              console.warn(fetchErr);
              throw new Error('Failed to fetch rating');
            }
          } else {
            const data = await ratingRes.json();
            setRating(data);
            setInitialRatingScore(data.score);
            setDebouncedRatingScore(data.score);
            setHasFetchedInitialRating(true);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      }
    };
    fetchRating();
  }, [shop, isAuthenticated, hasFetchedInitialRating]);

  // 0.1s delay before sending request. This does mean if user straight away refresh page, it will not be reflected
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (canMutateRating) {
        setDebouncedRatingScore(newRatingScore);
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [newRatingScore, canMutateRating]);

  useEffect(() => {
    const mutateRating = async () => {
      setError(null);
      try {
        if (shop) {
          if (rating && debouncedRatingScore !== 0) {
            if (rating.score !== debouncedRatingScore) {
              const res = await fetch(
                `${config.apiUrl}/protected/shops/${shop.id}/ratings`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ score: debouncedRatingScore }),
                  credentials: 'include',
                }
              );
              if (!res.ok) {
                throw new Error(await res.text());
              }
              const data = await res.json();
              setRating(data.rating);
            }
          } else if (rating) {
            const res = await fetch(
              `${config.apiUrl}/protected/shops/${shop.id}/ratings`,
              {
                method: 'DELETE',
                credentials: 'include',
              }
            );
            if (!res.ok) {
              throw new Error(await res.text());
            }
            setRating(null);
          } else if (debouncedRatingScore !== 0) {
            const res = await fetch(
              `${config.apiUrl}/protected/shops/${shop.id}/ratings`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score: debouncedRatingScore }),
                credentials: 'include',
              }
            );
            if (!res.ok) {
              throw new Error(await res.text());
            }
            setRating(await res.json());
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };
    if (canMutateRating) {
      mutateRating();
    }
  }, [debouncedRatingScore]);
  return { initialRatingScore, hasFetchedInitialRating, error };
}
