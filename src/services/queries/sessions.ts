import type { Session } from '$services/types';
import { sessionsKey } from '$services/keys';
import { client } from '$services/redis';

export const getSession = async (id: string) => {
	// get the session with id and return it
	return await client.hGetAll(sessionsKey(id));
};

export const saveSession = async (session: Session) => {};
