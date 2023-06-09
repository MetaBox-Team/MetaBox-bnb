declare module 'borc' {
  import {Buffer} from 'types/borc';

  class Decoder {
    constructor(opts: { size: Number; tags: Record<number, (val: any) => any> });

    decodeFirst(input: ArrayBuffer): any;
  }

  export function encode(o: any): Buffer | null;

  class Tagged {
    tag: number;
    value: any;

    constructor(tag: Number, value: any);
  }
}
