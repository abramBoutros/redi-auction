import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car1', {
		color: 'red',
		year: 1950
	});
	await client.hSet('car2', {
		color: 'red',
		year: 1955
	});
	await client.hSet('car3', {
		color: 'red',
		year: 1960
	});

	const commands = [1, 2, 3].map((id) => client.hGetAll('car' + id));

	const results = await Promise.all(commands);

	console.log(results);

	// const car = await client.hGetAll('car#1412412');

	// if (Object.keys(car).length === 0) {
	// 	return console.log('car not found return 404');
	// }
	// console.log(car);
};
run();
