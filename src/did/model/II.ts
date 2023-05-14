import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export interface Delegation {
  'pubkey': Uint8Array,
  'targets': [] | [Array<Principal>],
  'expiration': bigint,
}

export type GetDelegationResponse = { 'no_such_delegation': null } |
  { 'signed_delegation': SignedDelegation };

export interface SignedDelegation {
  'signature': Uint8Array,
  'delegation': Delegation,
}

export type WalletSig = { 'MetaMask': [string, string, string] } |
  { 'Other': [string, string] };

export interface _SERVICE {
  'get_delegation': ActorMethod<[Uint8Array, Uint8Array, bigint],
    GetDelegationResponse>,
  'prepare_delegation': ActorMethod<[[] | [bigint], WalletSig],
    [Uint8Array, bigint]>,
}
