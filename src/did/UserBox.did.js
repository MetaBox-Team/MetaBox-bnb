export const idlFactory = ({ IDL }) => {
  const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const State = IDL.Record({
    'balance' : IDL.Nat,
    'memory_size' : IDL.Nat,
    'heap_size' : IDL.Nat,
  });
  const DataErr = IDL.Variant({
    'FileKeyErr' : IDL.Null,
    'FilePublic' : IDL.Null,
    'BlobSizeError' : IDL.Null,
    'PermissionDenied' : IDL.Null,
    'SharedRepeat' : IDL.Null,
    'FlagErr' : IDL.Null,
    'SharedNotSet' : IDL.Null,
    'MemoryInsufficient' : IDL.Null,
    'FileAesPubKeyNotExist' : IDL.Null,
    'UserAccessErr' : IDL.Null,
    'DeviceNotExist' : IDL.Null,
    'ShareRepeat' : IDL.Null,
  });
  const Result_12 = IDL.Variant({ 'ok' : State, 'err' : DataErr });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : DataErr });
  const Result_11 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : DataErr });
  const AssetExt = IDL.Record({
    'file_extension' : IDL.Text,
    'upload_status' : IDL.Bool,
    'bucket_id' : IDL.Principal,
    'aes_pub_key' : IDL.Opt(IDL.Text),
    'file_name' : IDL.Text,
    'file_key' : IDL.Text,
    'total_size' : IDL.Nat64,
    'need_query_times' : IDL.Nat,
  });
  const FileExt = IDL.Variant({
    'EncryptFileExt' : AssetExt,
    'SharedFileExt' : IDL.Record({
      'file_extension' : IDL.Text,
      'other' : IDL.Principal,
      'description' : IDL.Text,
      'file_name' : IDL.Text,
      'file_key' : IDL.Text,
      'isPublic' : IDL.Bool,
    }),
    'PlainFileExt' : AssetExt,
  });
  const Result_1 = IDL.Variant({ 'ok' : FileExt, 'err' : DataErr });
  const Result_10 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Vec(FileExt), IDL.Vec(FileExt), IDL.Vec(FileExt)),
    'err' : DataErr,
  });
  const Status = IDL.Variant({
    'stopped' : IDL.Null,
    'stopping' : IDL.Null,
    'running' : IDL.Null,
  });
  const CanisterState = IDL.Record({
    'status' : Status,
    'memory_size' : IDL.Nat,
    'cycles' : IDL.Nat,
  });
  const GET = IDL.Record({ 'flag' : IDL.Nat, 'file_key' : IDL.Text });
  const Result_9 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'err' : DataErr,
  });
  const Result_8 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Principal),
    'err' : DataErr,
  });
  const Result_7 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Principal),
    'err' : IDL.Text,
  });
  const Result_6 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Nat8), 'err' : DataErr });
  const PostExt = IDL.Record({
    'tag' : IDL.Text,
    'title' : IDL.Text,
    'time' : IDL.Text,
    'file_key' : IDL.Text,
    'author' : IDL.Text,
    'need_query_times' : IDL.Nat,
  });
  const Result_5 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Nat, IDL.Vec(PostExt)),
    'err' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Vec(FileExt), 'err' : DataErr });
  const ThumbNail = IDL.Record({
    'file_extension' : IDL.Text,
    'image' : IDL.Vec(IDL.Nat8),
  });
  const Result_3 = IDL.Variant({ 'ok' : ThumbNail, 'err' : DataErr });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const CallbackToken__1 = IDL.Record({
    'key' : IDL.Text,
    'max_index' : IDL.Nat,
    'index' : IDL.Nat,
  });
  const StreamingCallbackHttpResponse__1 = IDL.Record({
    'token' : IDL.Opt(CallbackToken__1),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : CallbackToken__1,
      'callback' : IDL.Func(
          [CallbackToken__1],
          [StreamingCallbackHttpResponse__1],
          ['query'],
        ),
    }),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamStrategy),
    'status_code' : IDL.Nat16,
  });
  const Chunk = IDL.Record({
    'data' : IDL.Vec(IDL.Nat8),
    'digest' : IDL.Vec(IDL.Nat8),
  });
  const PUT = IDL.Variant({
    'segment' : IDL.Record({
      'file_extension' : IDL.Text,
      'order' : IDL.Nat,
      'chunk_number' : IDL.Nat,
      'chunk' : Chunk,
      'aes_pub_key' : IDL.Opt(IDL.Text),
      'file_name' : IDL.Text,
      'file_key' : IDL.Text,
      'total_size' : IDL.Nat64,
    }),
    'thumb_nail' : IDL.Record({
      'file_extension' : IDL.Text,
      'aes_pub_key' : IDL.Opt(IDL.Text),
      'file_name' : IDL.Text,
      'file_key' : IDL.Text,
      'image' : IDL.Vec(IDL.Nat8),
    }),
  });
  const FilePut = IDL.Variant({
    'EncryptFilePut' : PUT,
    'SharedFilePut' : IDL.Record({
      'file_extension' : IDL.Text,
      'other' : IDL.Principal,
      'aes_pub_key' : IDL.Opt(IDL.Text),
      'description' : IDL.Text,
      'file_name' : IDL.Text,
      'file_key' : IDL.Text,
      'isPublic' : IDL.Bool,
    }),
    'PlainFilePut' : PUT,
  });
  const PostMetaInfo = IDL.Record({
    'tag' : IDL.Text,
    'title' : IDL.Text,
    'time' : IDL.Text,
    'file_key' : IDL.Text,
    'author' : IDL.Text,
  });
  const CallbackToken = IDL.Record({
    'key' : IDL.Text,
    'max_index' : IDL.Nat,
    'index' : IDL.Nat,
  });
  const StreamingCallbackHttpResponse = IDL.Record({
    'token' : IDL.Opt(CallbackToken__1),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const UserBox = IDL.Service({
    'addFollow' : IDL.Func([IDL.Principal], [Result_2], []),
    'addOwner' : IDL.Func([IDL.Principal], [Result_2], []),
    'avlSM' : IDL.Func([], [IDL.Nat64], ['query']),
    'canisterState' : IDL.Func([], [Result_12], ['query']),
    'clearall' : IDL.Func([], [Result], []),
    'cycleBalance' : IDL.Func([], [Result_11], ['query']),
    'deleteOwner' : IDL.Func([IDL.Principal], [Result_2], []),
    'deleteShareFile' : IDL.Func([IDL.Text, IDL.Principal], [Result], []),
    'deleteSharedFile' : IDL.Func([IDL.Text], [Result], []),
    'deletekey' : IDL.Func([IDL.Text], [Result], []),
    'getAssetextkey' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'getAssetexts' : IDL.Func([], [Result_10], ['query']),
    'getBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getCanisterState' : IDL.Func([], [CanisterState], ['query']),
    'getDefaultDeviceShareDap' : IDL.Func([IDL.Text], [Result], ['query']),
    'getEncrypt' : IDL.Func([GET], [Result_9], ['query']),
    'getFileShareOther' : IDL.Func([IDL.Text], [Result_8], ['query']),
    'getFollowings' : IDL.Func([], [Result_7], ['query']),
    'getOwners' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getPlain' : IDL.Func([GET], [Result_6], ['query']),
    'getPostsOfPage' : IDL.Func([IDL.Nat], [Result_5], ['query']),
    'getProfile' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'getShareFiles' : IDL.Func([], [Result_4], ['query']),
    'getSharedAesPublic' : IDL.Func([IDL.Text], [Result], ['query']),
    'getThumbnail' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'profileUpdate' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        [Result_2],
        [],
      ),
    'put' : IDL.Func([FilePut], [Result_1], []),
    'putPost' : IDL.Func([FilePut, PostMetaInfo], [Result_1], []),
    'setShareFile' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Text],
        [Result],
        [],
      ),
    'streamingCallback' : IDL.Func(
        [CallbackToken],
        [StreamingCallbackHttpResponse],
        ['query'],
      ),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return UserBox;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
