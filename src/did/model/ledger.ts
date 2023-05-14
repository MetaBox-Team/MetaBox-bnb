export type AccountIdentifier = Array<number>;
export type AccountIdentifier__1 = Array<number>;
export type BlockIndex = bigint;

export interface ICP {
    'e8s': bigint
}

export interface Ledger {
    'account_balance': (arg_0: { 'account': AccountIdentifier__1 }) => Promise<ICP>,
    'transfer': (
        arg_0: {
            'to': AccountIdentifier__1,
            'fee': ICP,
            'memo': Memo,
            'subaccount': [] | [Subaccount],
            'created_at_time': [] | [Timestamp],
            'amount': ICP,
        },
    ) => Promise<TransferResult>,
}

export type Memo = bigint;
export type Subaccount = Array<number>;

export interface Timestamp {
    'timestamp_nanos': bigint
}

export type TransferError = {
    'TxTooOld': { 'allowed_window_nanos': bigint }
} |
    { 'BadFee': { 'expected_fee': ICP } } |
    { 'TxDuplicate': { 'duplicate_of': BlockIndex } } |
    { 'TxCreatedInFuture': null } |
    { 'InsufficientFunds': { 'balance': ICP } };
export type TransferResult = { 'Ok': BlockIndex } |
    { 'Err': TransferError };

export interface _SERVICE extends Ledger {
}
