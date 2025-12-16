export function dateToStringCustomFormat(aDate: Date) {
	return `${aDate.toLocaleDateString()} ${aDate.getHours()}:${aDate.getMinutes() < 10 ? '0' + aDate.getMinutes() : aDate.getMinutes()}`;
}

export function createDeferred<T>() {
	let resolve!: (value: T | PromiseLike<T>) => void;
	let reject!: (reason?: unknown) => void;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}
