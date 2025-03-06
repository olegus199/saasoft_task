<script
    setup
    lang="ts"
>
import { IAccount, IMark } from "../types/accounts.ts";

interface Props {
  account: IAccount;
}

type InputType = "select" | "textarea" | string;

type InputsData = {
  id: string;
  value: string;
  type: InputType;
  accountKey: keyof AccountWithoutId;
};

type AccountWithoutId = Omit<IAccount, "id">

type Labels = Record<keyof AccountWithoutId, string>

const labels: Labels = {
  type: "Тип записи",
  login: "Логин",
  password: "Пароль",
  marks: "Метки",
};

const { account } = defineProps<Props>();
let inputsData: InputsData[] = [];

const filteredAccounts = Object.entries(account).filter(([key, _]) => key !== "id");

filteredAccounts.forEach(([key, value]) => {
  let accountKey = key as keyof AccountWithoutId;
  let inputData: InputsData;

  switch (accountKey) {
    case "type":
      inputData = {
        type: "select",
        id: accountKey + account.id,
        value,
        accountKey,
      };
      break;
    case "marks": {
      const marksValue = value as IMark[];
      const marksExtracted = marksValue.map((v) => v.text).join("; ");
      inputData = {
        type: "textarea",
        id: accountKey + account.id,
        value: marksExtracted,
        accountKey,
      };
    }
      break;
    case "login":
      inputData = {
        type: "text",
        id: accountKey + account.id,
        value,
        accountKey,
      };
      break;
    case "password":
      inputData = {
        type: "password",
        id: accountKey + account.id,
        value,
        accountKey,
      };
      break;
  }

  inputsData.push(inputData);
});

</script>

<template>
  <form
      class="account-form"
  >
    <div
        class="input-container"
        v-for="(input, idx) of inputsData"
        :key="idx"
    >
      <label :for="input.id">{{ labels[input.accountKey] }}</label>
      <textarea
          v-if="input.type === 'textarea'"
          :id="input.id"
      />
      <select
          v-else-if="input.type==='select'"
          :id="input.id"
      >
        <option value="local">local</option>
        <option value="ldap">ldap</option>
      </select>
      <input
          v-else
          :type="input.type"
          :id="input.id"
          v-model="account[input.accountKey]"
      />
    </div>
  </form>
</template>

<style
    scoped
    lang="scss"
>
.account-form {
  display: flex;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
}

.input-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-right: 1.25rem;
  }
}
</style>