import { HttpParameterCodec } from '@angular/common/http';
/**
 * Custom HttpParameterCodec
 * Workaround for https://github.com/angular/angular/issues/18261
 */
export declare class CustomHttpParameterCodec implements HttpParameterCodec {
    encodeKey(k: string): string;
    encodeValue(v: string): string;
    decodeKey(k: string): string;
    decodeValue(v: string): string;
}
