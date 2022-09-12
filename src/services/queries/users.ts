import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernamesUniqueKey, usernamesKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
	// use the username argument to look up the persons user id
	// with the usernames sorted set
	const decimalId = await client.zScore(usernamesKey(), username);

	// make sure we actually got an ID from the lookup
	if (!decimalId) {
		throw new Error('User does not exist');
	}
	// take the the id and convert it back to hex
	const hexId = decimalId.toString(16);
	// use the id to lookup the user's hash
	const userHash = await client.hGetAll(usersKey(hexId));

	// deserialize and return the hash
	return deserialize(hexId, userHash);
};

export const getUserById = async (id: string) => {
	// create user key
	const userKey: string = usersKey(id);

	const user = await client.hGetAll(userKey);

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs): Promise<string> => {
	// check if the username is already exists
	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username);
	// if yes, throw an error
	if (exists) {
		throw new Error('username is taken');
	}

	// create a random id for user
	const id: string = genId();

	// create user key
	const userKey: string = usersKey(id);

	// create user hash with the user key
	await client.hSet(userKey, serialize(attrs));
	// dd the username to the unique usernames set for future checking
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	// add the username with the id to a sorted set to connect them when sign in
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	});
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
