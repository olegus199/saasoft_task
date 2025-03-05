<script
    setup
    lang="ts"
>
import Hint from "./components/Hint.vue";
</script>

<template>
  <div class="heading">
    <h1>Учетные записи</h1>
    <button>
      <i class="pi pi-plus" />
    </button>
  </div>
  <Hint />
</template>

<style lang="scss">

.heading {
  display: flex;
  align-items: center;
}
</style>