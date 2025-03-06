export interface IAccount {
  marks: IMark[];
  type: AccountType;
  login: string;
  password: string | null;
  id: string;
}

export interface IMark {
  text: string;
}

type AccountType = "local" | "ldap"