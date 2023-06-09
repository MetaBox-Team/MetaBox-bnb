import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export type AccountIdentifier = Uint8Array;
export type BackUp = { 'One': Array<[Principal, Array<Principal>]> } |
  { 'Six': Array<[Principal, string]> } |
  { 'Two': Array<[Principal, bigint]> } |
  { 'Seven': Array<Principal> } |
  { 'Five': Array<[string, Principal]> } |
  { 'Four': Array<[Principal, Principal]> } |
  { 'Three': Array<[Principal, BoxState__1]> };
export type BlockIndex = bigint;
export type BlockIndex__1 = bigint;

export interface BoxAllInfo {
  'status': BoxStatus,
  'owner': Principal,
  'avatar_key': string,
  'canister_id': Principal,
  'is_private': boolean,
  'box_name': string,
  'box_type': BoxType,
}

export interface BoxInfo {
  'status': BoxStatus,
  'canister_id': Principal,
  'is_private': boolean,
  'box_name': string,
  'box_type': BoxType,
}

export interface BoxInfo__1 {
  'status': BoxStatus,
  'canister_id': Principal,
  'is_private': boolean,
  'box_name': string,
  'box_type': BoxType,
}

export interface BoxMetadata {
  'is_private': boolean,
  'box_name': string,
  'box_type': BoxType,
}

export interface BoxState {
  'status': BoxStatus,
  'owner': Principal,
  'avatar_key': string,
  'is_private': boolean,
  'box_name': string,
  'box_type': BoxType,
}

export interface BoxState__1 {
  'status': BoxStatus,
  'owner': Principal,
  'avatar_key': string,
  'is_private': boolean,
  'box_name': string,
  'box_type': BoxType,
}

export type BoxStatus = { 'stopped': null } |
  { 'running': null };
export type BoxType = { 'xid': null } |
  { 'data_box': null } |
  { 'profile': null };
export type BurnError = { 'InsufficientBalance': null } |
  { 'InvalidTokenContract': null } |
  { 'NotSufficientLiquidity': null };

export interface CreateBoxArgs {
  'metadata': BoxMetadata
}

export interface DelBoxArgs {
  'cycleTo': [] | [Principal],
  'box_type': BoxType,
  'canisterId': Principal,
}

export type Error = { 'NoFreeBoxNum': null } |
  { 'NoUnBoundOg': null } |
  { 'Named': null } |
  { 'NoBox': null } |
  { 'DataBoxNotExist': null } |
  { 'OnlyDataBoxCanDeleted': null } |
  { 'BalanceNotEnough': null } |
  { 'NameRepeat': null } |
  { 'UnAuthorized': null } |
  { 'DataBoxEnough': null } |
  { 'DataBoxNotShareTo': null } |
  { 'CreateBoxOnWay': null } |
  { 'SomethingErr': null } |
  { 'LedgerTransferError': bigint } |
  { 'Invalid_Operation': null } |
  { 'NotBoxOwner': null } |
  { 'NoProfile': null } |
  { 'ProfileEnough': null } |
  { 'NotifyCreateError': bigint };

export interface MetaBox {
  'acceptSharedBox': ActorMethod<[Principal, Principal], Result>,
  'addAdmin': ActorMethod<[Principal], boolean>,
  'addControlWhiteList': ActorMethod<[Principal], boolean>,
  'burnxtc': ActorMethod<[bigint], RustResult>,
  'changeAdmin': ActorMethod<[Array<Principal>], boolean>,
  'changeBoxAvatarKey': ActorMethod<[string], undefined>,
  'clearLog': ActorMethod<[], undefined>,
  'createDataBoxControl': ActorMethod<[CreateBoxArgs, boolean, [] | [Principal]],
    Result_6>,
  'createDataBoxFee': ActorMethod<[CreateBoxArgs, boolean], Result_6>,
  'createDataBoxFree': ActorMethod<[CreateBoxArgs], Result_6>,
  'createDataBoxServer': ActorMethod<[CreateBoxArgs, Principal], Principal>,
  'createProfile': ActorMethod<[Uint8Array], Result_6>,
  'deleteBox': ActorMethod<[DelBoxArgs], Result_5>,
  'emitShareBox': ActorMethod<[Principal, Principal], Result>,
  'getAdmins': ActorMethod<[], Array<Principal>>,
  'getAllPC': ActorMethod<[], Array<Principal>>,
  'getBackUp': ActorMethod<[bigint], BackUp>,
  'getBoxState': ActorMethod<[Principal], Result_4>,
  'getBoxes': ActorMethod<[Principal], Array<BoxAllInfo>>,
  'getControlWhitelist': ActorMethod<[], Array<Principal>>,
  'getCycleBalance': ActorMethod<[], bigint>,
  'getDataBoxVersion': ActorMethod<[], bigint>,
  'getIcp': ActorMethod<[], bigint>,
  'getLog': ActorMethod<[], Array<[bigint, string]>>,
  'getNameFromPrincipal': ActorMethod<[Principal], [] | [string]>,
  'getNamePrin': ActorMethod<[Principal], [] | [string]>,
  'getPre': ActorMethod<[], [bigint, bigint]>,
  'getPrincipalFromName': ActorMethod<[string], [] | [Principal]>,
  'getProfile': ActorMethod<[Principal], [] | [Principal]>,
  'getProfileVersion': ActorMethod<[], bigint>,
  'getShareBoxes': ActorMethod<[], Array<BoxAllInfo>>,
  'getSharedBoxes': ActorMethod<[], Array<BoxAllInfo>>,
  'getTotal': ActorMethod<[], [bigint, bigint]>,
  'getUserBalance': ActorMethod<[], [] | [bigint]>,
  'initPreCreateDatabox': ActorMethod<[], Result_3>,
  'initPreCreateProfile': ActorMethod<[], Result_3>,
  'installCycleWasm': ActorMethod<[Uint8Array], Result>,
  'isNotFirstDataBox': ActorMethod<[], boolean>,
  'preCreateDataBox': ActorMethod<[], Result_3>,
  'preCreateDataBoxOne': ActorMethod<[], Result>,
  'preCreateProfile': ActorMethod<[], Result_3>,
  'preCreateProfileOne': ActorMethod<[], Result_3>,
  'refreshBalance': ActorMethod<[Principal], undefined>,
  'removeShareBox': ActorMethod<[Principal, Principal], Result>,
  'removeSharedBox': ActorMethod<[Principal, Principal], Result>,
  'selfburn': ActorMethod<[bigint], RustResult>,
  'setName': ActorMethod<[string], Result>,
  'startBox': ActorMethod<[BoxInfo__1], undefined>,
  'stopBox': ActorMethod<[BoxInfo__1], undefined>,
  'topUpBox': ActorMethod<[TopUpArgs], Result>,
  'transferDataboxOwner': ActorMethod<[Principal, Principal], Result>,
  'transferOutICP': ActorMethod<[AccountIdentifier, bigint], Result_2>,
  'updateBoxInfo': ActorMethod<[BoxInfo__1], Result>,
  'updateDataBoxVersion': ActorMethod<[bigint], boolean>,
  'updateProfileVersion': ActorMethod<[bigint], boolean>,
  'updateWasm': ActorMethod<[UpdateWasmArgs], Result_1>,
  'upgradeBox': ActorMethod<[UpgradeBoxArgs], Result>,
  'wallet_receive': ActorMethod<[], undefined>,
  'xdrUpdate': ActorMethod<[], boolean>,
}

export type Result = { 'ok': null } |
  { 'err': Error };
export type Result_1 = { 'ok': string } |
  { 'err': string };
export type Result_2 = { 'ok': BlockIndex__1 } |
  { 'err': TransferError };
export type Result_3 = { 'ok': Array<Principal> } |
  { 'err': Error };
export type Result_4 = { 'ok': BoxState } |
  { 'err': Error };
export type Result_5 = { 'ok': string } |
  { 'err': Error };
export type Result_6 = { 'ok': Principal } |
  { 'err': Error };
export type RustResult = { 'Ok': bigint } |
  { 'Err': BurnError };

export interface Token {
  'e8s': bigint
}

export interface TopUpArgs {
  'box_id': Principal,
  'icp_amount': bigint
}

export type TransferError = {
  'TxTooOld': { 'allowed_window_nanos': bigint }
} |
  { 'BadFee': { 'expected_fee': Token } } |
  { 'TxDuplicate': { 'duplicate_of': BlockIndex } } |
  { 'TxCreatedInFuture': null } |
  { 'InsufficientFunds': { 'balance': Token } };

export interface UpdateWasmArgs {
  'wasm': Uint8Array,
  'box_type': BoxType
}

export interface UpgradeBoxArgs {
  'info': BoxInfo
}

export interface _SERVICE extends MetaBox {
}
