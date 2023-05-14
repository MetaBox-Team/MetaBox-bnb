import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export type AccountIdentifier = Array<number>;
export type BlockIndex = bigint;
export type BlockIndex__1 = bigint;

export interface OG {
  'boundOg': ActorMethod<[Principal], undefined>,
  'burn': ActorMethod<[AccountIdentifier, bigint], Result>,
  'getCycleBalance': ActorMethod<[], bigint>,
  'getOgNum': ActorMethod<[Principal], bigint>,
}

export type Result = { 'ok': BlockIndex__1 } |
  { 'err': TransferError };

export interface Token {
  'e8s': bigint
}

export type TransferError = {
  'TxTooOld': { 'allowed_window_nanos': bigint }
} |
  { 'BadFee': { 'expected_fee': Token } } |
  { 'TxDuplicate': { 'duplicate_of': BlockIndex } } |
  { 'TxCreatedInFuture': null } |
  { 'InsufficientFunds': { 'balance': Token } };

export interface _SERVICE extends OG {
}
