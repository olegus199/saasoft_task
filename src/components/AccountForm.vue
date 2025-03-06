<script
    setup
    lang="ts"
>
import { IAccount, IAccountValues, IMark } from "../types/accounts.ts";
import { useAccountsStore } from "../stores/accountsStore.ts";
import { computed, ref, watch } from "vue";
import { generateErrorMsg } from "../utils/account-form-utils.ts";

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

type FormInfo = Record<keyof AccountWithoutId, string>

type InputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const labels: FormInfo = {
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

const inputErrors = ref<FormInfo>({
  login: "",
  password: "",
  marks: "",
  accountType: "",
});

function handleInputChange<T extends InputElements>(e: Event, inputType: InputType): void {
  const name = (e.target as T).name as keyof IAccount;
  const value = (e.target as T).value;
  const valueLen = value.length;
  const accountId = account.id;

  // Reset input errors
  inputErrors.value = {
    ...inputErrors.value,
    [name]: "",
  };

  switch (inputType) {
    case "textarea": {
      const maxLen = 50;
      if (valueLen > maxLen) {
        inputErrors.value = {
          ...inputErrors.value,
          marks: generateErrorMsg(maxLen),
        };
        return;
      }

      const marksArray: IMark[] = value.split(";").map((v) => ({ text: v }));
      accountsStore.updateAccountField<IMark[]>(accountId, "marks", marksArray);
    }
      break;
    case "select":
      // Set value of 'password' to null if accountType === "ldap" (and "" if === "local")
      if (value === "ldap") {
        accountsStore.updateAccountField(accountId, "password", null);
      } else {
        accountsStore.updateAccountField(accountId, "password", "");
      }
      break;
    case "text":
    case "password": {
      // Length validation
      const maxLen = 100;
      if ((name === "login" || name === "password") && valueLen > 100) {
        inputErrors.value = {
          ...inputErrors.value,
          [name]: generateErrorMsg(maxLen),
        };
        return;
      }

      accountsStore.updateAccountField(accountId, name, value);
    }
      break;
    default:
      break;
  }
}

const passwordVisible = ref(false);

function togglePasswordVisibility(): void {
  passwordVisible.value = !passwordVisible.value;
}

watch(
    () => accountsStore.accounts,
    (accounts) => {
      console.log(accounts[0]);
    },
    { deep: true },
);
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
      <div>
        <label :for="input.id">{{ labels[input.accountKey] }}</label>
        <div v-if="input.type === 'password'">
          <input
              :type="passwordVisible ? 'text' : 'password'"
              :id="input.id"
              :name="input.accountKey"
              @input="(e) => handleInputChange<HTMLInputElement>(e, input.type)"
              :value="input.value"
          />
          <button
              type="button"
              @click="togglePasswordVisibility"
          >
            <i :class="passwordVisible ? 'pi pi-eye-slash' : 'pi pi-eye'" />
          </button>
        </div>
        <textarea
            v-if="input.type === 'textarea'"
            :id="input.id"
            :name="input.accountKey"
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
            v-else-if="input.type==='text'"
            :type="input.type"
            :id="input.id"
            :name="input.accountKey"
            @input="(e) => handleInputChange<HTMLInputElement>(e, input.type)"
            :value="input.value"
        />
      </div>
      <p v-if="inputErrors[input.accountKey]">{{ inputErrors[input.accountKey] }}</p>
    </div>
  </form>
</template>

<style
    scoped
    lang="scss"
>
.account-form {
  display: flex;
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