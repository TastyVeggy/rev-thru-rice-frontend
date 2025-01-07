import { config } from '../config';
import { Review, ReviewReq } from '../interfaces/review';

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
    throw new Error('unable to create review');
  }
  const data = await res.json();
  return data.review as Review;
};
