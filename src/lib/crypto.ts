import CryptoJS from 'crypto-js';

// All vault data is encrypted using a key derived from the PIN.
// For true stealth, we don't store the PIN, we derive the encryption key from it.

export const encrypt = (text: string, secret: string) => {
  return CryptoJS.AES.encrypt(text, secret).toString();
};

export const decrypt = (ciphertext: string, secret: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null;
  }
};

export const deriveKey = (pin: string, salt: string) => {
  return CryptoJS.PBKDF2(pin, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString();
};
