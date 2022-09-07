import type { Session } from '$services/types';
import { sessionsKey } from '$services/keys';
import { client } from '$services/redis';
import { genId } from '$services/utils';

export const getSession = async (id: string) => {
	// get the session with id and return it
	const session = await client.hGetAll(sessionsKey(id));

	if (Object.keys(session).length === 0) {
		return null;
	}

	return deserialize(id, session);
};

export const saveSession = async (session: Session) => {
	// create session key
	const sessionKey: string = sessionsKey(session.id);
	// return session hash with the session key
	return client.hSet(sessionKey, serialize(session));
};

const serialize = (session: Session) => {
	return {
		userId: session.userId,
		username: session.username
	};
};

const deserialize = (id: string, session: { [key: string]: string }) => {
	return {
		id,
		userId: session.userId,
		username: session.username
	};
};
