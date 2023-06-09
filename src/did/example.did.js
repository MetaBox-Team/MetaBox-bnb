export const idlFactory = ({IDL}) => {
    const BucketErr = IDL.Variant({
        'Append_Error': IDL.Null,
        'BlobSizeError': IDL.Null,
        'INSUFFICIENT_MEMORY': IDL.Null,
        'INVALID_KEY': IDL.Null,
    });
    const Result_11 = IDL.Variant({'ok': IDL.Null, 'err': BucketErr});
    const State = IDL.Record({
        'balance': IDL.Nat,
        'memory_size': IDL.Nat,
        'stable_memory_size': IDL.Nat64,
    });
    const DataErr = IDL.Variant({
        'FileKeyErr': IDL.Null,
        'FilePublic': IDL.Null,
        'BlobSizeError': IDL.Null,
        'PermissionDenied': IDL.Null,
        'SharedRepeat': IDL.Null,
        'FlagErr': IDL.Null,
        'SharedNotSet': IDL.Null,
        'MemoryInsufficient': IDL.Null,
        'FileAesPubKeyNotExist': IDL.Null,
        'UserAccessErr': IDL.Null,
        'DeviceNotExist': IDL.Null,
        'ShareRepeat': IDL.Null,
    });
    const Result_10 = IDL.Variant({'ok': State, 'err': DataErr});
    const Result_1 = IDL.Variant({'ok': IDL.Text, 'err': DataErr});
    const Result_9 = IDL.Variant({'ok': IDL.Nat, 'err': DataErr});
    const AssetExt = IDL.Record({
        'file_extension': IDL.Text,
        'upload_status': IDL.Bool,
        'bucket_id': IDL.Principal,
        'aes_pub_key': IDL.Opt(IDL.Text),
        'file_name': IDL.Text,
        'file_key': IDL.Text,
        'total_size': IDL.Nat64,
        'need_query_times': IDL.Nat,
    });
    const FileExt = IDL.Variant({
        'EncryptFileExt': AssetExt,
        'SharedFileExt': IDL.Record({
            'file_extension': IDL.Text,
            'other': IDL.Principal,
            'description': IDL.Text,
            'file_name': IDL.Text,
            'file_key': IDL.Text,
            'isPublic': IDL.Bool,
        }),
        'PlainFileExt': AssetExt,
    });
    const Result_2 = IDL.Variant({'ok': FileExt, 'err': DataErr});
    const Result_8 = IDL.Variant({
        'ok': IDL.Tuple(IDL.Vec(FileExt), IDL.Vec(FileExt), IDL.Vec(FileExt)),
        'err': DataErr,
    });
    const GET = IDL.Record({'flag': IDL.Nat, 'file_key': IDL.Text});
    const Result_7 = IDL.Variant({
        'ok': IDL.Vec(IDL.Vec(IDL.Nat8)),
        'err': DataErr,
    });
    const Result_6 = IDL.Variant({
        'ok': IDL.Vec(IDL.Principal),
        'err': DataErr,
    });
    const Result_5 = IDL.Variant({'ok': IDL.Vec(IDL.Nat8), 'err': DataErr});
    const Result_4 = IDL.Variant({'ok': IDL.Vec(FileExt), 'err': DataErr});
    const ThumbNail = IDL.Record({
        'file_extension': IDL.Text,
        'image': IDL.Vec(IDL.Nat8),
    });
    const Result_3 = IDL.Variant({'ok': ThumbNail, 'err': DataErr});
    const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
    const HttpRequest = IDL.Record({
        'url': IDL.Text,
        'method': IDL.Text,
        'body': IDL.Vec(IDL.Nat8),
        'headers': IDL.Vec(HeaderField),
    });
    const CallbackToken__1 = IDL.Record({
        'key': IDL.Text,
        'max_index': IDL.Nat,
        'index': IDL.Nat,
    });
    const StreamingCallbackHttpResponse__1 = IDL.Record({
        'token': IDL.Opt(CallbackToken__1),
        'body': IDL.Vec(IDL.Nat8),
    });
    const StreamStrategy = IDL.Variant({
        'Callback': IDL.Record({
            'token': CallbackToken__1,
            'callback': IDL.Func(
                [CallbackToken__1],
                [StreamingCallbackHttpResponse__1],
                ['query'],
            ),
        }),
    });
    const HttpResponse = IDL.Record({
        'body': IDL.Vec(IDL.Nat8),
        'headers': IDL.Vec(HeaderField),
        'streaming_strategy': IDL.Opt(StreamStrategy),
        'status_code': IDL.Nat16,
    });
    const Result = IDL.Variant({'ok': IDL.Null, 'err': DataErr});
    const Chunk = IDL.Record({'data': IDL.Vec(IDL.Nat8)});
    const PUT = IDL.Variant({
        'segment': IDL.Record({
            'file_extension': IDL.Text,
            'order': IDL.Nat,
            'chunk_number': IDL.Nat,
            'chunk': Chunk,
            'aes_pub_key': IDL.Opt(IDL.Text),
            'file_name': IDL.Text,
            'file_key': IDL.Text,
            'total_size': IDL.Nat64,
        }),
        'thumb_nail': IDL.Record({
            'file_extension': IDL.Text,
            'aes_pub_key': IDL.Opt(IDL.Text),
            'file_name': IDL.Text,
            'file_key': IDL.Text,
            'image': IDL.Vec(IDL.Nat8),
        }),
    });
    const FilePut = IDL.Variant({
        'EncryptFilePut': PUT,
        'SharedFilePut': IDL.Record({
            'file_extension': IDL.Text,
            'other': IDL.Principal,
            'aes_pub_key': IDL.Opt(IDL.Text),
            'description': IDL.Text,
            'file_name': IDL.Text,
            'file_key': IDL.Text,
            'isPublic': IDL.Bool,
        }),
        'PlainFilePut': PUT,
    });
    const CallbackToken = IDL.Record({
        'key': IDL.Text,
        'max_index': IDL.Nat,
        'index': IDL.Nat,
    });
    const StreamingCallbackHttpResponse = IDL.Record({
        'token': IDL.Opt(CallbackToken__1),
        'body': IDL.Vec(IDL.Nat8),
    });
    const Avatar = IDL.Record({
        'data': IDL.Vec(IDL.Nat8),
        'data_type': IDL.Text,
    });
    const DataBox = IDL.Service({
        'avlSM': IDL.Func([], [IDL.Nat64], ['query']),
        'bucket_put': IDL.Func(
            [IDL.Text, IDL.Vec(IDL.Nat8), IDL.Nat],
            [Result_11],
            [],
        ),
        'canisterState': IDL.Func([], [Result_10], ['query']),
        'clearall': IDL.Func([], [Result_1], []),
        'cycleBalance': IDL.Func([], [Result_9], ['query']),
        'deleteShareFile': IDL.Func([IDL.Text, IDL.Principal], [Result_1], []),
        'deleteSharedFile': IDL.Func([IDL.Text], [Result_1], []),
        'deletekey': IDL.Func([IDL.Text], [Result_1], []),
        'getAssetextkey': IDL.Func([IDL.Text], [Result_2], ['query']),
        'getAssetexts': IDL.Func([], [Result_8], ['query']),
        'getDefaultDeviceShareDap': IDL.Func([IDL.Text], [Result_1], ['query']),
        'getEncrypt': IDL.Func([GET], [Result_7], ['query']),
        'getFileShareOther': IDL.Func([IDL.Text], [Result_6], ['query']),
        'getPlain': IDL.Func([GET], [Result_5], ['query']),
        'getShareFiles': IDL.Func([], [Result_4], ['query']),
        'getSharedAesPublic': IDL.Func([IDL.Text], [Result_1], ['query']),
        'getThumbnail': IDL.Func([IDL.Text], [Result_3], ['query']),
        'http_request': IDL.Func([HttpRequest], [HttpResponse], ['query']),
        'initOwner': IDL.Func([IDL.Principal], [Result], []),
        'put': IDL.Func([FilePut], [Result_2], []),
        'setShareFile': IDL.Func(
            [IDL.Text, IDL.Principal, IDL.Text],
            [Result_1],
            [],
        ),
        'streamingCallback': IDL.Func(
            [CallbackToken],
            [StreamingCallbackHttpResponse],
            ['query'],
        ),
        'upload': IDL.Func([Avatar], [Result], []),
        'wallet_receive': IDL.Func([], [IDL.Nat], []),
        'xun_getPage': IDL.Func([], [IDL.Nat64], ['query']),
    });
    return DataBox;
};
export const init = ({IDL}) => {
    return [];
};
