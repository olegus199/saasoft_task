<script
    setup
    lang="ts"
>
import AccountForm from "./AccountForm.vue";
import { useAccountsStore } from "../stores/accountsStore.ts";
import { watch } from "vue";

const accounts = useAccountsStore().accounts;

// watch(
//     () => accounts,
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
    <AccountForm
        v-for="(account, idx) of accounts"
        :account="account"
        :key="idx"
    />
  </div>
</template>

<style
    scoped
    lang="scss"
>

</style>