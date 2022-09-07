import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {};

export const createUser = async (attrs: CreateUserAttrs) => {
	// create a random id
	const userId: string = genId();
	// create user key
	const userKey: string = usersKey(userId);
	// create user hash with the user key
	await client.hSet(userKey, {
		username: attrs.username,
		password: attrs.password
	});

	// return user id
	return userId;
};
