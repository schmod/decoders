// @flow

import { Result } from 'lemons';

import { DecodeError } from './asserts';
import type { Decoder, Verifier } from './types';

const DECODER_MARK = Symbol('DECODER_MARK');

/**
 * Will verify that the passed-in arbitrary object indeed is an Object,
 * and return it.  Otherwise throws a runtime error.
 */
export function asObject(blob: any): Object {
    if (typeof blob !== 'object') {
        throw DecodeError('Not an object', 'Expected an object', blob);
    }

    return (blob: Object);
}

export function isDecoderError(error: Error): boolean {
    // $FlowFixMe
    return !!error[DECODER_MARK];
}

export function buildDecoder<T>(verifier: Verifier<T>): Decoder<T> {
    return (blob: any) => verifier(blob).unwrap();
}

export const toDecoder = buildDecoder;

export function toVerifier<T>(decoder: Decoder<T>): Verifier<T> {
    return (blob: any) => {
        try {
            const result: T = decoder(blob);
            return Result.ok(result);
        } catch (err) {
            if (isDecoderError(err)) {
                return Result.err(err.message);
            }

            // Re-throw it, it's something else
            throw err;
        }
    };
}
