import BigNumber from "bignumber.js";

//desensitization
export const desensitizationPrincipal = (info: string, len: number = 3) => {
    return (
        info.substring(0, len) +
        "..." +
        info.substring(info.length - len, info.length)
    );
};

export const formatNumber = (
    value: number,
    decimals?: number
): string | number => {
    if (value < 10) {
        if (decimals) {
            return value.toFixed(decimals);
        } else {
            return value.toFixed(1);
        }
    } else {
        let st = value.toString().split(".")[0];
        if (st.length < 4) return st;
        if (st.length < 7) return `${st.substring(0, st.length - 3)}K`;
        if (st.length < 10) return `${st.substring(0, st.length - 6)}M`;
        if (st.length < 13) return `${st.substring(0, st.length - 9)}G`;
        if (st.length < 13) return `${st.substring(0, st.length - 12)}T`;
    }

    return value;
};
