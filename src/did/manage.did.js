export const idlFactory = ({IDL}) => {
    return IDL.Service({'rand': IDL.Func([], [IDL.Vec(IDL.Nat8)], [])});
};
export const init = ({IDL}) => {
    return [];
};
