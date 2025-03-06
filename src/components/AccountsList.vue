<script
    setup
    lang="ts"
>
import AccountForm from "./AccountForm.vue";
import { useAccountsStore } from "../stores/accountsStore.ts";
import { watch } from "vue";

const accountsStore = useAccountsStore();

watch(
    () => accountsStore.accounts,
    (accounts) => {
      localStorage.setItem("accounts", JSON.stringify(accounts));
    },
    { deep: true },
);
</script>

<template>
  <div
      class="accounts-list"
  >
    <div
        v-for="(account, idx) of accountsStore.accounts"
        :key="idx"
        class="account-item"
    >
      <AccountForm
          :account="account"
      />
      <button
          @click="accountsStore.removeAccount(account.id)"
          class="delete-button"
      >
        <i :class="'pi pi-trash'" />
      </button>
    </div>
  </div>
</template>

<style
    scoped
    lang="scss"
>
@use "../mixins" as *;
@use "../variables" as *;

.accounts-list {
  margin-top: 5.625rem;
}

.account-item {
  @include flex_align-center();

  &:not(:last-child) {
    margin-bottom: 1.75rem;
  }
}

.delete-button {
  @include reset_button_defaults();
  @include flex_center();

  color: $gray;
  font-size: 1.25rem;
  transition: color $standard_transition;

  &:hover {
    color: $supporting_red;
  }
}
</style>