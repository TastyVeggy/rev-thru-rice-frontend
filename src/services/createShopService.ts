import { config } from '../config';
import { Review } from '../hooks/useFetchReviews';
import { PostReq } from './createPostService';

export interface ReviewReq {
  post: PostReq;
  shop: {
    name: string;
    lat: number;
    lng: number;
    address: string | null;
    country: string;
  };
  rating: { score: number };
}

export const createReviewService = async (
  review: ReviewReq,
  subforum_id: string
) => {
  const res = await fetch(
    `${config.apiUrl}/protected/subforums/${subforum_id}/shop_review`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
      credentials: 'include',
    }
  );
  if (!res.ok) {
    const error = await res.text();
    console.log(error);
    throw new Error('unable to create review');
  }
  const data = await res.json();
  return data.review as Review;
};
