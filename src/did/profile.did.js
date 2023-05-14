export const idlFactory = ({IDL}) => {
  const Link = IDL.Record({
    'url': IDL.Text,
    'image_url': IDL.Opt(IDL.Text),
    'name': IDL.Text,
  });
  const Err = IDL.Variant({
    'INVALID_LINK': IDL.Null,
    'MISMATCH_TOTAL_SIZE': IDL.Null,
    'EXISTED_LINK': IDL.Null,
    'EMPTY_USER_ID': IDL.Null,
    'INVALID_GET_FLAG': IDL.Null,
    'FAILED_TO_GET_STATE': IDL.Null,
    'INCORRECT_CHUNK_DATA_SIZE': IDL.Null,
    'INVALID_CHUNK_DATA_SIZE': IDL.Null,
    'ISUFFICIENT_MEMORY': IDL.Null,
    'INVALID_TOTAL_SIZE': IDL.Null,
    'PERMISSION_DENIED': IDL.Null,
    'INVALID_FILE_KEY': IDL.Null,
    'INVALID_IMAGE_KEY': IDL.Null,
  });
  const Result = IDL.Variant({'ok': IDL.Null, 'err': Err});
  const State = IDL.Record({'memory_size': IDL.Nat, 'heap_size': IDL.Nat});
  const Result_6 = IDL.Variant({'ok': State, 'err': Err});
  const Result_5 = IDL.Variant({'ok': IDL.Opt(IDL.Text), 'err': Err});
  const Result_4 = IDL.Variant({'ok': Link, 'err': Err});
  const GET = IDL.Record({'flag': IDL.Nat, 'file_key': IDL.Text});
  const Result_3 = IDL.Variant({'ok': IDL.Vec(IDL.Nat8), 'err': Err});
  const HeapAssetExt = IDL.Record({
    'file_extension': IDL.Text,
    'upload_status': IDL.Bool,
    'canister_id': IDL.Principal,
    'file_name': IDL.Text,
    'file_key': IDL.Text,
    'total_size': IDL.Nat64,
    'need_query_times': IDL.Nat,
  });
  const Profile__1 = IDL.Record({
    'avatar_url': IDL.Text,
    'name': IDL.Text,
    'description': IDL.Text,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url': IDL.Text,
    'method': IDL.Text,
    'body': IDL.Vec(IDL.Nat8),
    'headers': IDL.Vec(HeaderField),
  });
  const StreamingToken__1 = IDL.Record({'key': IDL.Text, 'index': IDL.Nat});
  const StreamingCallbackHttpResponse__1 = IDL.Record({
    'token': IDL.Opt(StreamingToken__1),
    'body': IDL.Vec(IDL.Nat8),
  });
  const StreamingStrategy = IDL.Variant({
    'Callback': IDL.Record({
      'token': StreamingToken__1,
      'callback': IDL.Func(
        [StreamingToken__1],
        [StreamingCallbackHttpResponse__1],
        ['query'],
      ),
    }),
  });
  const HttpResponse = IDL.Record({
    'body': IDL.Vec(IDL.Nat8),
    'headers': IDL.Vec(HeaderField),
    'streaming_strategy': IDL.Opt(StreamingStrategy),
    'status_code': IDL.Nat16,
  });
  const Chunk = IDL.Record({'data': IDL.Vec(IDL.Nat8)});
  const PUT = IDL.Record({
    'file_extension': IDL.Text,
    'chunk_number': IDL.Nat,
    'chunk': Chunk,
    'file_name': IDL.Text,
    'file_key': IDL.Text,
    'total_size': IDL.Nat64,
    'chunk_order': IDL.Nat,
  });
  const Result_2 = IDL.Variant({'ok': HeapAssetExt, 'err': Err});
  const Avatar = IDL.Record({
    'image_data': IDL.Vec(IDL.Nat8),
    'image_type': IDL.Text,
  });
  const SetLinkArgs = IDL.Record({
    'new_url': IDL.Text,
    'old_url': IDL.Text,
    'image_url': IDL.Opt(IDL.Text),
    'name': IDL.Opt(IDL.Text),
  });
  const SetProfileArgs = IDL.Record({
    'avatar_url': IDL.Opt(IDL.Text),
    'name': IDL.Opt(IDL.Text),
    'description': IDL.Opt(IDL.Text),
  });
  const Result_1 = IDL.Variant({'ok': Profile__1, 'err': Err});
  const StreamingToken = IDL.Record({'key': IDL.Text, 'index': IDL.Nat});
  const StreamingCallbackHttpResponse = IDL.Record({
    'token': IDL.Opt(StreamingToken__1),
    'body': IDL.Vec(IDL.Nat8),
  });
  const Profile = IDL.Service({
    'acceptCycle': IDL.Func([], [], []),
    'addLink': IDL.Func([Link], [Result], []),
    'delLink': IDL.Func([IDL.Text], [Result], []),
    'deleteLinkImage': IDL.Func([IDL.Text], [Result], []),
    'getCanisterStatus': IDL.Func([], [Result_6], ['query']),
    'getCycleBalance': IDL.Func([], [IDL.Nat], ['query']),
    'getEncryptedSecretKey': IDL.Func([], [Result_5], ['query']),
    'getLink': IDL.Func([IDL.Text], [Result_4], ['query']),
    'getLinkImage': IDL.Func([GET], [Result_3], ['query']),
    'getLinkImageExts': IDL.Func([], [IDL.Vec(HeapAssetExt)], ['query']),
    'getLinks': IDL.Func([], [IDL.Vec(Link)], ['query']),
    'getOwner': IDL.Func([], [IDL.Principal], ['query']),
    'getProfile': IDL.Func([], [Profile__1], ['query']),
    'getPublicKey': IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'getVersion': IDL.Func([], [IDL.Nat], ['query']),
    'http_request': IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'putLinkImage': IDL.Func([PUT], [Result_2], []),
    'setAvatar': IDL.Func([Avatar], [Result], []),
    'setEncryptedSecretKey': IDL.Func([IDL.Opt(IDL.Text)], [Result], []),
    'setLink': IDL.Func([SetLinkArgs], [Result], []),
    'setProfile': IDL.Func([SetProfileArgs], [Result_1], []),
    'setPublicKey': IDL.Func([IDL.Opt(IDL.Text)], [Result], []),
    'streamingCallback': IDL.Func(
      [StreamingToken],
      [StreamingCallbackHttpResponse],
      ['query'],
    ),
  });
  return Profile;
};
export const init = ({IDL}) => {
  return [IDL.Principal];
};
