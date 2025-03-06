export interface IAccount {
  marks: IMark[];
  accountType: AccountType;
  login: string;
  password: PasswordType;
  id: string;
}

export interface IMark {
  text: string;
}

type AccountType = "local" | "ldap"

export type PasswordType = string | null;