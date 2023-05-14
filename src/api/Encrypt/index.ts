import {AESEncryptApi} from ".."

class Encrypt {
  //encrypt the rsa privatekey by pinkey
  async encryptPrivateKey(pinKey, privateKey, aesIv) {
    return AESEncryptApi.AESEncData(privateKey, pinKey, aesIv)
  }

  //decrypt the privatekey
  async decryptPrivateKey(pinKey, encryptedPrivateKey, aesIv) {
    const plainText = AESEncryptApi.AESDecData(
      encryptedPrivateKey.buffer,
      pinKey,
      aesIv
    )
    return new TextDecoder().decode(plainText)
    // return await RSAEncryptApi.importPrivateKey(plainTextstring)
  }

  async pinToPrivate(prePrivateKey, pinkeyHash) {
    const aesIv = prePrivateKey && prePrivateKey.slice(0, 128);
    const encryptedPrivateKey = prePrivateKey && prePrivateKey.slice(128);
    const buf = new ArrayBuffer(encryptedPrivateKey.length);
    const bufView = new Uint8Array(buf);
    for (
      let i = 0, strLen = encryptedPrivateKey.length;
      i < strLen;
      i++
    ) {
      bufView[i] = encryptedPrivateKey.charCodeAt(i);
    }
    return await this.decryptPrivateKey(
      pinkeyHash,
      bufView,
      aesIv
    )
  }

  async aesKeyGen() {
    let aesKey: string = ""
    const array = new BigUint64Array(16)
    window.crypto.getRandomValues(array)
    array.forEach(v => {
      aesKey += v.toString(16)
    })
    while (aesKey.length < 256) aesKey += "0"
    return aesKey
  }

}

export const EncryptApi = new Encrypt()
