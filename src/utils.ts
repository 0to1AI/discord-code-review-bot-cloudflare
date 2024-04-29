type PromiseToTupleResult<T> = [Error, null] | [null, Awaited<T>];
export const unpackPromise = async <T extends Promise<unknown>>(
	promise: T,
): Promise<PromiseToTupleResult<T>> => {
	try {
		const result = await promise;
		return [null, result];
	} catch (maybeError) {
		if (maybeError instanceof Error) {
			return [maybeError, null];
		}
		return [new Error(String(maybeError)), null];
	}
};

type ThrowableToTupleResult<T> = [Error, null] | [null, T];
export const unpackThrowable = <T>(throwable: () => T): ThrowableToTupleResult<T> => {
	try {
		const result = throwable();
		return [null, result];
	} catch (maybeError) {
		if (maybeError instanceof Error) {
			return [maybeError, null];
		}
		return [new Error(String(maybeError)), null];
	}
};

function invariant(condition: unknown, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

export function stringToUint8Array(value: string, format?: "hex"): Uint8Array {
	if (!value) {
		return new Uint8Array();
	}

	if (format === "hex") {
		const octets = /^[a-fA-F0-9]+$/.test(value) && value.match(/.{1,2}/g);
		invariant(octets, "Value is not a valid hex string");
		const hexVal = octets.map((byte) => Number.parseInt(byte, 16));
		return new Uint8Array(hexVal);
	}

	return new TextEncoder().encode(value);
}

export function concatUint8Arrays(arr1: Uint8Array, arr2: Uint8Array): Uint8Array {
	const newArray = new Uint8Array(arr1.length + arr2.length);
	newArray.set(arr1);
	newArray.set(arr2, arr1.length);
	return newArray;
}
