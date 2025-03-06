import { defineStore } from "pinia";
import { IAccount, IAccountValues, IMark, PasswordType } from "../types/accounts.ts";
import { v4 } from "uuid";
import { watch } from "vue";

interface State {
  accounts: IAccount[];
}

const initAccount: IAccount = {
  id: "",
  marks: [],
  accountType: "local",
  login: "",
  password: "",
};

const accountsStorage = localStorage.getItem("accounts");
const parsedAccounts: IAccount[] = accountsStorage ? JSON.parse(accountsStorage) : [];

export const useAccountsStore = defineStore("accounts", {
  state: (): State => ({
    accounts: [...parsedAccounts],
  }),
  actions: {
    addAccount() {
      const account: IAccount = {
        ...initAccount,
        id: v4(),
      };
      this.accounts.push(account);
    },
    updateAccountField<T extends IAccountValues>(
      id: string, field: keyof IAccount, value: T) {
      const index = this.accounts.findIndex(account => account.id === id);
      if (index > -1) {
        switch (field) {
          case "marks":
            this.accounts[index][field] = value as IMark[];
            break;
          case "password":
            this.accounts[index][field] = value as PasswordType;
            break;
          case "login":
            this.accounts[index][field] = value as string;
            break;
          default:
            break;
        }
      }
    },
    removeAccount(id: string) {
      const index = this.accounts.findIndex(account => account.id === id);
      if (index > -1) {
        this.accounts.splice(index, 1);
      }
    },
  },
});