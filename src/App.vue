<script
    setup
    lang="ts"
>
import Hint from "./components/Hint.vue";
import { useAccountsStore } from "./stores/accountsStore.ts";
import AccountsList from "./components/AccountsList.vue";

function handleAddAccount(): void {
  useAccountsStore().addAccount();
}
</script>

<template>
  <div class="heading">
    <h1>Учетные записи</h1>
    <button @click="handleAddAccount">
      <i class="pi pi-plus" />
    </button>
  </div>

  <Hint />

  <AccountsList />
</template>

<style lang="scss">

.heading {
  display: flex;
  align-items: center;
}
</style>