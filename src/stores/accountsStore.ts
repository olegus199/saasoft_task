import { defineStore } from "pinia";
import { IAccount } from "../types/accounts.ts";
import { v4 } from "uuid";
import { watch } from "vue";

interface State {
  accounts: IAccount[];
}

const initAccount: IAccount = {
  id: "",
  marks: [],
  type: "local",
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
  },
});

// const accountsStore = useAccountsStore();
//
// watch(
//   () => accountsStore.accounts,
//   (accounts) => {
//     localStorage.setItem("accounts", JSON.stringify(accounts));
//   },
//   { deep: true },
// );