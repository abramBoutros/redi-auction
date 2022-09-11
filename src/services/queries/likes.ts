import { getItems } from '$services/queries/items';
import { client } from '$services/redis';
import { userLikesKey, itemsKey } from '$services/keys';

export const userLikesItem = async (itemId: string, userId: string) => {
	return client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
	// get all items ids from this user's liked set
	const ids: string[] = await client.sMembers(userLikesKey(userId));

	// fetch all the item hashes with those ids and return an array
	return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
	const inserted: number = await client.sAdd(userLikesKey(userId), itemId);
	// returns 0 or 1

	if (inserted) {
		return client.hIncrBy(itemsKey(itemId), 'likes', 1);
	}
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const removed: number = await client.sRem(userLikesKey(userId), itemId);
	// returns 0 or 1

	if (removed) {
		return client.hIncrBy(itemsKey(itemId), 'likes', -1);
	}
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)]);

	return getItems(ids);
};
