<script
    setup
    lang="ts"
>
import AccountForm from "./AccountForm.vue";
import { useAccountsStore } from "../stores/accountsStore.ts";
import { watch } from "vue";

const accountsStore = useAccountsStore();

// watch(
//     () => accountsStore.accounts,
//     (accounts) => {
//       localStorage.setItem("accounts", JSON.stringify(accounts));
//     },
//     { deep: true },
// );
</script>

<template>
  <div
      class="accounts-list"
  >
    <div
        v-for="(account, idx) of accountsStore.accounts"
        :key="idx"
    >
      <AccountForm
          :account="account"
      />
      <button @click="accountsStore.removeAccount(account.id)">
        <i :class="'pi pi-trash'" />
      </button>
    </div>
  </div>
</template>

<style
    scoped
    lang="scss"
>

</style>