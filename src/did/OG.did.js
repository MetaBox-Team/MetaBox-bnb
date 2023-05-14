export const idlFactory = ({IDL}) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const BlockIndex__1 = IDL.Nat64;
  const Token = IDL.Record({'e8s': IDL.Nat64});
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    'TxTooOld': IDL.Record({'allowed_window_nanos': IDL.Nat64}),
    'BadFee': IDL.Record({'expected_fee': Token}),
    'TxDuplicate': IDL.Record({'duplicate_of': BlockIndex}),
    'TxCreatedInFuture': IDL.Null,
    'InsufficientFunds': IDL.Record({'balance': Token}),
  });
  const Result = IDL.Variant({'ok': BlockIndex__1, 'err': TransferError});
  const OG = IDL.Service({
    'boundOg': IDL.Func([IDL.Principal], [], []),
    'burn': IDL.Func([AccountIdentifier, IDL.Nat], [Result], []),
    'getCycleBalance': IDL.Func([], [IDL.Nat64], ['query']),
    'getOgNum': IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
  });
  return OG;
};
export const init = ({IDL}) => {
  return [];
};
