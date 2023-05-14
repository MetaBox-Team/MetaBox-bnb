import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export type ApproveStatus = { 'NeedFinishKeySync': null } |
    { 'NeedKeySync': string } |
    { 'Approved': null };
export type Error = { 'SyncKeyNotFound': null } |
    { 'PubKeyNotFound': null };

export interface PreApproveArgs {
    'device_name': string
}

export interface PreSyncArgs {
    'encrypted_key': string
}

export type Result = { 'Ok': string } |
    { 'Err': Error };

export interface _SERVICE {
    'finishSync': ActorMethod<[], Result>,
    'getPubKey': ActorMethod<[Principal], Result>,
    'getSyncStatus': ActorMethod<[], ApproveStatus>,
    'preApprove': ActorMethod<[PreApproveArgs], undefined>,
    'preSync': ActorMethod<[PreSyncArgs], undefined>,
    'setPubKey': ActorMethod<[string], undefined>,
}
