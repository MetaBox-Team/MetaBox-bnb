import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export interface Avatar {
  'image_data': Array<number> | Uint8Array,
  'image_type': string
}

export interface Chunk {
  'data': Array<number> | Uint8Array
}

export type Err = { 'INVALID_LINK': null } |
  { 'MISMATCH_TOTAL_SIZE': null } |
  { 'EXISTED_LINK': null } |
  { 'EMPTY_USER_ID': null } |
  { 'INVALID_GET_FLAG': null } |
  { 'FAILED_TO_GET_STATE': null } |
  { 'INCORRECT_CHUNK_DATA_SIZE': null } |
  { 'INVALID_CHUNK_DATA_SIZE': null } |
  { 'ISUFFICIENT_MEMORY': null } |
  { 'INVALID_TOTAL_SIZE': null } |
  { 'PERMISSION_DENIED': null } |
  { 'INVALID_FILE_KEY': null } |
  { 'INVALID_IMAGE_KEY': null };

export interface GET {
  'flag': bigint,
  'file_key': string
}

export type HeaderField = [string, string];

export interface HeapAssetExt {
  'file_extension': string,
  'upload_status': boolean,
  'canister_id': Principal,
  'file_name': string,
  'file_key': string,
  'total_size': bigint,
  'need_query_times': bigint,
}

export interface HttpRequest {
  'url': string,
  'method': string,
  'body': Array<number>,
  'headers': Array<HeaderField>,
}

export interface HttpResponse {
  'body': Array<number>,
  'headers': Array<HeaderField>,
  'streaming_strategy': [] | [StreamingStrategy],
  'status_code': number,
}

export interface Link {
  'url': string,
  'image_url': [] | [string],
  'name': string,
}

export interface PUT {
  'file_extension': string,
  'chunk_number': bigint,
  'chunk': Chunk,
  'file_name': string,
  'file_key': string,
  'total_size': bigint,
  'chunk_order': bigint,
}

export interface Profile {
  'acceptCycle': ActorMethod<[], undefined>,
  'addLink': ActorMethod<[Link], Result>,
  'delLink': ActorMethod<[string], Result>,
  'deleteLinkImage': ActorMethod<[string], Result>,
  'getCanisterStatus': ActorMethod<[], Result_6>,
  'getCycleBalance': ActorMethod<[], bigint>,
  'getEncryptedSecretKey': ActorMethod<[], Result_5>,
  'getLink': ActorMethod<[string], Result_4>,
  'getLinkImage': ActorMethod<[GET], Result_3>,
  'getLinkImageExts': ActorMethod<[], Array<HeapAssetExt>>,
  'getLinks': ActorMethod<[], Array<Link>>,
  'getOwner': ActorMethod<[], Principal>,
  'getProfile': ActorMethod<[], Profile__1>,
  'getPublicKey': ActorMethod<[], [] | [string]>,
  'getVersion': ActorMethod<[], bigint>,
  'http_request': ActorMethod<[HttpRequest], HttpResponse>,
  'putLinkImage': ActorMethod<[PUT], Result_2>,
  'setAvatar': ActorMethod<[Avatar], Result>,
  'setEncryptedSecretKey': ActorMethod<[[] | [string]], Result>,
  'setLink': ActorMethod<[SetLinkArgs], Result>,
  'setProfile': ActorMethod<[SetProfileArgs], Result_1>,
  'setPublicKey': ActorMethod<[[] | [string]], Result>,
  'streamingCallback': ActorMethod<[StreamingToken],
    StreamingCallbackHttpResponse>,
}

export interface Profile__1 {
  'avatar_url': string,
  'name': string,
  'description': string,
}

export type Result = { 'ok': null } |
  { 'err': Err };
export type Result_1 = { 'ok': Profile__1 } |
  { 'err': Err };
export type Result_2 = { 'ok': HeapAssetExt } |
  { 'err': Err };
export type Result_3 = { 'ok': Array<number> } |
  { 'err': Err };
export type Result_4 = { 'ok': Link } |
  { 'err': Err };
export type Result_5 = { 'ok': [] | [string] } |
  { 'err': Err };
export type Result_6 = { 'ok': State } |
  { 'err': Err };

export interface SetLinkArgs {
  'new_url': string,
  'old_url': string,
  'image_url': [] | [string],
  'name': [] | [string],
}

export interface SetProfileArgs {
  'avatar_url': [] | [string],
  'name': [] | [string],
  'description': [] | [string],
}

export interface State {
  'memory_size': bigint,
  'heap_size': bigint
}

export interface StreamingCallbackHttpResponse {
  'token': [] | [StreamingToken__1],
  'body': Array<number>,
}

export interface StreamingCallbackHttpResponse__1 {
  'token': [] | [StreamingToken__1],
  'body': Array<number>,
}

export type StreamingStrategy = {
  'Callback': {
    'token': StreamingToken__1,
    'callback': [Principal, string],
  }
};

export interface StreamingToken {
  'key': string,
  'index': bigint
}

export interface StreamingToken__1 {
  'key': string,
  'index': bigint
}

export interface _SERVICE extends Profile {
}
