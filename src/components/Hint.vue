<script
    setup
    lang="ts"
>

</script>

<template>
  <div class="hint-container">
    <i class="pi pi-question-circle" />
    <p class="hint-text">
      Для указания нескольких меток для одной пары логин/пароль используйте
      разделитель "<b>;</b>"
    </p>
  </div>
</template>

<style
    lang="scss"
    scoped
>
@use "../mixins" as *;
@use "../variables" as *;

.hint-container {
  @include flex_align-center();
  width: fit-content;
  margin-top: 4.375rem;
  padding: 1.25rem .875rem;
  border-radius: .75rem;
  background-color: $primary_200;
  color: $primary_100;
}

.pi-question-circle {
  margin-right: 1.125rem;
  font-size: 1.5rem;
}

.hint-text {
  font-size: 1.125rem;

  b {

  }
}

</style>