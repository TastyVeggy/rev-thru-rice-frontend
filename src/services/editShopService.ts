import { config } from '../config';
import { Shop, ShopReq } from '../interfaces/review';

export const editShopService = async (shop: ShopReq, shopID: number) => {
  const res = await fetch(`${config.apiUrl}/protected/shops/${shopID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shop),
    credentials: 'include',
  });
  if (!res.ok) {
    console.warn(await res.text());
    throw new Error('unable to edit shop');
  }
  const data = await res.json();
  return data.shop as Shop;
};
