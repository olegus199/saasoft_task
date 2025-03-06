<script
    setup
    lang="ts"
>
import { IAccount, IMark } from "../types/accounts.ts";
import { useAccountsStore } from "../stores/accountsStore.ts";
import { computed, ref, watch } from "vue";

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

type InputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const labels: Labels = {
  accountType: "Тип записи",
  login: "Логин",
  password: "Пароль",
  marks: "Метки",
};

const { account } = defineProps<Props>();
const accountsStore = useAccountsStore();

const inputsData = computed(() => {
  let result: InputsData[] = [];

  // Filter out "id" field, because I don't need it in inputs
  const filteredAccounts = Object.entries(account).filter(([key, _]) => key !== "id");

  filteredAccounts.forEach(([key, value]) => {
    let accountKey = key as keyof AccountWithoutId;
    let inputData: InputsData;

    switch (accountKey) {
      case "accountType":
        inputData = {
          type: "select",
          id: accountKey + account.id,
          value,
          accountKey,
        };
        break;
      case "marks": {
        const marksValue = value as IMark[];
        const marksExtracted = marksValue.map((v) => v.text).join(";");
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

    result.push(inputData);
  });

  // Filter out "password" input if accountType === "ldap"
  if (account.accountType === "ldap") {
    result = result.filter((input) => input.type !== "password");
  }

  return result;
});

function handleInputChange<T extends InputElements>(e: Event, inputType: InputType): void {
  const value = (e.target as T).value;
  const accountId = account.id;

  switch (inputType) {
    case "select":
      // Set value of 'password' to null if accountType === "ldap" (and "" if === "local")
      if (value === "ldap") {
        accountsStore.updateAccountField(accountId, "password", null);
      } else {
        accountsStore.updateAccountField(accountId, "password", "");
      }
      break;
    case "textarea":
      const marksArray: IMark[] = value.split(";").map((v) => ({ text: v }));
      accountsStore.updateAccountField<IMark[]>(account.id, "marks", marksArray);
      break;
    default:
      break;
  }
}
</script>

<template>
  <form
      class="account-form"
  >
    <div
        v-for="(input, idx) of inputsData"
        :key="idx"
        class="input-container"
    >
      <label :for="input.id">{{ labels[input.accountKey] }}</label>
      <textarea
          v-if="input.type === 'textarea'"
          :id="input.id"
          @input="(e) => handleInputChange<HTMLTextAreaElement>(e, input.type)"
          :value="input.value"
      />
      <select
          v-else-if="input.type==='select'"
          :id="input.id"
          @change="(e) => handleInputChange<HTMLSelectElement>(e, input.type)"
          v-model="account[input.accountKey]"
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