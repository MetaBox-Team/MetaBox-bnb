export const change_chain = async (chainId: string) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId,
        },
      ],
    });
  } catch (e) {
    throw e
  }
}
