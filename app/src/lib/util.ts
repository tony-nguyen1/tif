import type { SubmitFunction } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

export function enhanceWithParam(
	formProcessing: boolean,
	fnMsgOnSuccess: () => string,
	fnMsgOnFailure: () => string
): SubmitFunction {
	return () => {
		formProcessing = true;
		const deferred = createDeferred();
		toast.promise(deferred.promise, {
			loading: 'Processing ...',
			success: (val) => {
				return val as string;
			},
			error: (reason) => reason as string
		});

		return async ({ result, update }) => {
			await update();

			// `result` is the object returned by the action of the server
			switch (result.type) {
				case 'success': {
					deferred.resolve(fnMsgOnSuccess());
					break;
				}
				case 'failure': {
					deferred.reject(fnMsgOnFailure());
					break;
				}
				case 'redirect': {
					deferred.resolve(`Redirected to ${result.location}`);
					break;
				}
				case 'error': {
					deferred.reject('Error, something went wrong');
					break;
				}
				default: {
					//statements;
					break;
				}
			}

			formProcessing = false;
		};
	};
}

export function dateToStringCustomFormat(aDate: Date) {
	return `${aDate.toLocaleDateString()} ${aDate.getHours()}:${aDate.getMinutes() < 10 ? '0' + aDate.getMinutes() : aDate.getMinutes()}`;
}

export function dateToStringChartTimeScaleFormattedWithTime(aDate: Date) {
	return `${aDate.getFullYear()}-${aDate.getMonth() < 10 ? '0' + (aDate.getMonth() + 1) : aDate.getMonth() + 1}-${aDate.getDate() < 10 ? '0' + aDate.getDate() : aDate.getDate()} ${aDate.getHours() < 10 ? '0' + aDate.getHours() : aDate.getHours()}:${aDate.getMinutes() < 10 ? '0' + aDate.getMinutes() : aDate.getMinutes()}:${aDate.getMinutes() < 10 ? '0' + aDate.getMinutes() : aDate.getMinutes()}`;
}

export function dateToStringChartTimeScaleFormatted(aDate: Date) {
	return `${aDate.getFullYear()}-${aDate.getMonth() < 10 ? '0' + (aDate.getMonth() + 1) : aDate.getMonth() + 1}-${aDate.getDate() < 10 ? '0' + aDate.getDate() : aDate.getDate()}`;
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

export function toInputDate(d: Date): string {
	return d.toISOString().slice(0, 10);
}

export function toInputTime(d: Date): string {
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
