export const idlFactory = ({IDL}) => {
    const Error = IDL.Variant({
        'SYNC_REPEAT': IDL.Null,
        'SYNC_KEY_ERROR': IDL.Null,
        'KEY_SIZE_ERR': IDL.Null,
        'SYNC_NOT_FOUND': IDL.Null,
        'INVALID_PRINCIPAL': IDL.Null,
        'APPROVE_NOT_EXIST': IDL.Null,
        'REGIST_REPEAT': IDL.Null,
    });
    const Result_2 = IDL.Variant({'ok': IDL.Nat, 'err': Error});
    const Result = IDL.Variant({'ok': IDL.Text, 'err': Error});
    const Status = IDL.Variant({
        'WAIT_FINISH': IDL.Null,
        'NO_APPROVE': IDL.Null,
        'APPROVE_NOT_SYNC': IDL.Null,
    });
    const Result_1 = IDL.Variant({'ok': Status, 'err': Error});
    const KeySync = IDL.Service({
        'cycleBalance': IDL.Func([], [Result_2], ['query']),
        'finishSyncApprove': IDL.Func([], [Result], []),
        'getApproveSyncStatus': IDL.Func([], [Result_1], ['query']),
        'getOtherPublicKey': IDL.Func([IDL.Principal], [Result], ['query']),
        'getOwnPublicKey': IDL.Func([], [Result], ['query']),
        'preApprove': IDL.Func([], [Result], []),
        'preSync': IDL.Func([IDL.Text], [Result], []),
        'registPublicKey': IDL.Func([IDL.Text], [Result], []),
        'wallet_receive': IDL.Func([], [IDL.Nat], []),
    });
    return KeySync;
};
export const init = ({IDL}) => {
    return [IDL.Principal];
};

