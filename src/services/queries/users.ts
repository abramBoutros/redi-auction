import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
	// create user key
	const userKey: string = usersKey(id);

	const user = await client.hGetAll(userKey);

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs): Promise<string> => {
	// create a random id for user
	const id: string = genId();
	// create user key
	const userKey: string = usersKey(id);
	// create user hash with the user key
	await client.hSet(userKey, serialize(attrs));

	// return user id
	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
