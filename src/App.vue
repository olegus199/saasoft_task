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
  <main class="main-section">
    <div class="heading">
      <h1 class="header">Учетные записи</h1>
      <button
          @click="handleAddAccount"
          class="add-account_button"
      >
        <i class="pi pi-plus" />
      </button>
    </div>

    <Hint />

    <AccountsList />
  </main>
</template>

<style
    lang="scss"
    scoped
>
@use "./mixins" as *;
@use "./variables" as *;

.main-section {
  max-width: 70rem;
  margin: 0 auto;
  padding: 5.65rem 1rem;
}

.heading {
  @include flex_align-center();
}

.header {
  margin-right: 2.625rem;
  font-size: 2rem;
  font-weight: 500;
}

.add-account_button {
  @include reset-button_defaults();
  @include flex_center();

  flex-shrink: 0;
  padding: .375rem .625rem;
  border: .125rem solid $primary_100;
  border-radius: .25rem;
  transition: background-color $standard_transition;

  &:hover {
    background-color: $primary_100;

    .pi-plus {
      color: $white;
    }
  }
}

.pi-plus {
  color: $primary_100;
  transition: color $standard_transition;
}

</style>