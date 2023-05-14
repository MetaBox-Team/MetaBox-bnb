/* tslint:disable */
/* eslint-disable */
/**
*/
export enum PayloadType {
  Wallet,
  II,
}
/**
*/
export class API {
  free(): void;
/**
* @param {number} t
* @param {Uint8Array} bytes
* @returns {Uint8Array}
*/
  static get_auth_header(t: number, bytes: Uint8Array): Uint8Array;
}
