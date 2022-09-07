import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car', {
		color: 'red',
		year: 1950
	});

	const car = await client.hGetAll('car#1412412');

	if (Object.keys(car).length === 0) {
		return console.log('car not found return 404');
	}
	console.log(car);
};
run();
