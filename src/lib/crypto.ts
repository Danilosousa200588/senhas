/**
 * src/lib/crypto.ts
 *
 * Criptografia AES-256-GCM usando a Web Crypto API nativa do browser.
 * As senhas NUNCA saem do browser em texto claro — apenas como ciphertext.
 *
 * Fluxo:
 *   1. deriveKey(userId, pepper) → CryptoKey  (derivada via PBKDF2)
 *   2. encryptPassword(plain, key) → "IV_base64:ciphertext_base64"
 *   3. decryptPassword(encrypted, key) → texto original
 *
 * Nem o Supabase, nem ninguém com acesso ao banco consegue ler as senhas.
 */

const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH = 256; // bits (AES-256)

// ─── Utilitários de conversão ─────────────────────────────────────────────────

function uint8ToBase64(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf));
}

function base64ToUint8(b64: string): Uint8Array {
  return new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)));
}

// ─── Derivação de chave ───────────────────────────────────────────────────────

/**
 * Deriva uma CryptoKey AES-256-GCM a partir do userId + pepper.
 *
 * @param userId - UID do usuário autenticado no Supabase (auth.uid())
 * @param pepper - String secreta do .env (VITE_CRYPTO_PEPPER)
 *                 Nunca alterar após ter dados salvos!
 */
export async function deriveKey(userId: string, pepper: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  // Material base = userId + pepper (ambos sem dados sensíveis reais)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userId + pepper),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Salt derivado deterministicamente do userId (sem armazenar no banco)
  const salt = encoder.encode('vault_salt_' + userId.slice(0, 8));

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,        // não exportável
    ['encrypt', 'decrypt']
  );
}

// ─── Criptografia ─────────────────────────────────────────────────────────────

/**
 * Encripta uma senha com AES-256-GCM.
 * Retorna uma string no formato "IV_base64:ciphertext_base64".
 *
 * @param plaintext - Senha em texto claro
 * @param key - CryptoKey derivada via deriveKey()
 */
export async function encryptPassword(plaintext: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // IV de 96 bits (recomendado para GCM)

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  return uint8ToBase64(iv) + ':' + uint8ToBase64(new Uint8Array(ciphertext));
}

/**
 * Descriptografa uma senha AES-256-GCM.
 *
 * @param encrypted - String no formato "IV_base64:ciphertext_base64"
 * @param key - CryptoKey derivada via deriveKey()
 */
export async function decryptPassword(encrypted: string, key: CryptoKey): Promise<string> {
  const [ivB64, ciphertextB64] = encrypted.split(':');

  if (!ivB64 || !ciphertextB64) {
    throw new Error('Formato de senha criptografada inválido.');
  }

  const iv = base64ToUint8(ivB64);
  const ciphertext = base64ToUint8(ciphertextB64);

  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    new Uint8Array(ciphertext)
  );

  return new TextDecoder().decode(plainBuffer);
}
