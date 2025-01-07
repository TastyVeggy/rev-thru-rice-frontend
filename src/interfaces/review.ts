import { Post, PostReq } from './post';

export interface Rating {
  score: number;
  shop_name: string;
  username: string;
}

export interface Shop {
  id: number;
  post_id: number;
  name: string;
  avg_rating: number;
  country_id: number;
  lat: number;
  lng: number;
  address: string | null;
  map_link: string;
}

export interface Review {
  post: Post;
  shop: Shop;
  rating: Rating;
}

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
