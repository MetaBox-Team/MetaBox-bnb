export const idlFactory = ({IDL}) => {
    const Error = IDL.Variant({
        'SyncKeyNotFound': IDL.Null,
        'PubKeyNotFound': IDL.Null,
    });
    const Result = IDL.Variant({'Ok': IDL.Text, 'Err': Error});
    const ApproveStatus = IDL.Variant({
        'NeedFinishKeySync': IDL.Null,
        'NeedKeySync': IDL.Text,
        'Approved': IDL.Null,
    });
    const PreApproveArgs = IDL.Record({'device_name': IDL.Text});
    const PreSyncArgs = IDL.Record({'encrypted_key': IDL.Text});
    return IDL.Service({
        'finishSync': IDL.Func([], [Result], []),
        'getPubKey': IDL.Func([IDL.Principal], [Result], ['query']),
        'getSyncStatus': IDL.Func([], [ApproveStatus], ['query']),
        'preApprove': IDL.Func([PreApproveArgs], [], []),
        'preSync': IDL.Func([PreSyncArgs], [], []),
        'setPubKey': IDL.Func([IDL.Text], [], []),
    });
};
export const init = ({IDL}) => {
    return [];
};
