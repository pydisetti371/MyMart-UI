export type AuthUser = {
  name: string;
  phone: string;
};

type StoredAccount = AuthUser & {
  salt: string;
  passwordHash: string;
};

const ACCOUNTS_KEY = "mymart.auth.accounts.v1";
const SESSION_KEY = "mymart.auth.session.v1";
const HASH_ITERATIONS = 210_000;

export const PHONE_PATTERN = /^\d{10}$/;
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,}$/;

function readAccounts(): StoredAccount[] {
  const serializedAccounts = localStorage.getItem(ACCOUNTS_KEY);
  if (!serializedAccounts) return [];

  try {
    const accounts: unknown = JSON.parse(serializedAccounts);
    if (!Array.isArray(accounts)) return [];
    return accounts.filter(
      (account): account is StoredAccount =>
        typeof account?.name === "string" &&
        typeof account?.phone === "string" &&
        typeof account?.salt === "string" &&
        typeof account?.passwordHash === "string",
    );
  } catch {
    return [];
  }
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function fromHex(value: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

async function hashPassword(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: HASH_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return toHex(new Uint8Array(hash));
}

export function accountExists(phone: string) {
  return readAccounts().some((account) => account.phone === phone);
}

export async function createAccount(
  name: string,
  phone: string,
  password: string,
): Promise<AuthUser> {
  const normalizedName = name.trim();
  const normalizedPhone = phone.trim();
  if (!normalizedName) throw new Error("Enter your name to create an account.");
  if (!PHONE_PATTERN.test(normalizedPhone)) {
    throw new Error("Enter a 10-digit phone number.");
  }
  if (!PASSWORD_PATTERN.test(password)) {
    throw new Error("Choose a password that meets all the listed requirements.");
  }

  const accounts = readAccounts();
  if (accounts.some((account) => account.phone === normalizedPhone)) {
    throw new Error("An account already uses this phone number. Please sign in.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const user = { name: normalizedName, phone: normalizedPhone };
  accounts.push({
    ...user,
    salt: toHex(salt),
    passwordHash: await hashPassword(password, salt),
  });
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return user;
}

export async function verifyCredentials(
  phone: string,
  password: string,
): Promise<AuthUser> {
  const normalizedPhone = phone.trim();
  if (!PHONE_PATTERN.test(normalizedPhone)) {
    throw new Error("Enter a 10-digit phone number.");
  }

  const account = readAccounts().find(
    (candidate) => candidate.phone === normalizedPhone,
  );
  if (!account) {
    throw new Error("No account uses this phone number. Please sign up.");
  }

  const candidateHash = await hashPassword(password, fromHex(account.salt));
  if (candidateHash !== account.passwordHash) {
    throw new Error("The password is incorrect. Please try again.");
  }

  return { name: account.name, phone: account.phone };
}

export function restoreSession(): AuthUser | null {
  const phone = localStorage.getItem(SESSION_KEY);
  if (!phone) return null;
  const account = readAccounts().find((candidate) => candidate.phone === phone);
  return account ? { name: account.name, phone: account.phone } : null;
}

export function saveSession(phone: string) {
  localStorage.setItem(SESSION_KEY, phone);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
