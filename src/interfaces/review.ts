import { Post, PostReq } from './post';

export interface Rating {
  id: number;
  shop_id: number;
  shop_name: string;
  user_id: number;
  username: string;
  score: number;
  created_at: number;
}

export interface Shop {
  id: number;
  post_id: number;
  post_title: string;
  name: string;
  avg_rating: number;
  country_id: number;
  country: string;
  lat: number;
  lng: number;
  address: string | null;
  map_link: string;
}

export interface ShopReq {
  name: string;
  lat: number;
  lng: number;
  address: string | null;
  country: string;
}

export interface Review {
  post: Post;
  shop: Shop;
  rating: Rating;
}

export interface ReviewReq {
  post: PostReq;
  shop: ShopReq;
  rating: { score: number };
}
