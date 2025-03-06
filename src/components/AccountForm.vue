<script
    setup
    lang="ts"
>
import { IAccount, IMark } from "../types/accounts.ts";
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
  placeholder: string;
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
          placeholder: "",
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
          placeholder: "xxx; yyy;",
          accountKey,
        };
      }
        break;
      case "login":
        inputData = {
          type: "text",
          id: accountKey + account.id,
          value,
          placeholder: "логин221",
          accountKey,
        };
        break;
      case "password":
        inputData = {
          type: "password",
          id: accountKey + account.id,
          value,
          placeholder: "сильный-пароль",
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
      if ((name === "login" || name === "password") && valueLen > maxLen) {
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
      <div class="input-block">
        <label
            :for="input.id"
            class="input-label"
        >{{ labels[input.accountKey] }}</label>
        <div
            v-if="input.type === 'password'"
            style="position: relative;"
        >
          <input
              :type="passwordVisible ? 'text' : 'password'"
              :id="input.id"
              :name="input.accountKey"
              @input="(e) => handleInputChange<HTMLInputElement>(e, input.type)"
              :value="input.value"
              :placeholder="input.placeholder"
              class="input"
          />
          <button
              type="button"
              @click="togglePasswordVisibility"
              class="toggle-password-visibility_button"
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
            :placeholder="input.placeholder"
            class="input input-textarea"
        />
        <select
            v-else-if="input.type==='select'"
            :id="input.id"
            @change="(e) => handleInputChange<HTMLSelectElement>(e, input.type)"
            v-model="account[input.accountKey]"
            class="input"
        >
          <option value="local">Локальная</option>
          <option value="ldap">LDAP</option>
        </select>
        <input
            v-else-if="input.type==='text'"
            :type="input.type"
            :id="input.id"
            :name="input.accountKey"
            :placeholder="input.placeholder"
            @input="(e) => handleInputChange<HTMLInputElement>(e, input.type)"
            :value="input.value"
            class="input"
        />
      </div>
      <p
          v-if="inputErrors[input.accountKey]"
          class="input-error-msg"
      >{{ inputErrors[input.accountKey] }}
      </p>
    </div>
  </form>
</template>

<style
    scoped
    lang="scss"
>
@use "../mixins" as *;
@use "../variables" as *;

.account-form {
  flex-grow: 1;
  display: flex;
  align-content: start;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-right: 1.75rem;
}

.input-container {
  @include flex_column();
  flex-grow: 1;
}

.input-block {
  @include flex_column();
}

.input-label {
  margin-bottom: .25rem;
  font-size: .75rem;
}

.input {
  width: 100%;
  padding: .75rem;
  font-family: "Onset", sans-serif;
  font-size: 1rem;
  border: 1px solid $gray;
  border-radius: .5rem;
  background-color: $white;

  &:focus {
    outline: none;
    border: 1px solid $black;
  }

}

select {
  -webkit-appearance: none;
}

.input-textarea {
  resize: none;
  height: 2.875rem;
}

.toggle-password-visibility_button {
  @include reset_button_defaults();
  position: absolute;
  top: 50%;
  right: .75rem;
  transform: translateY(-50%);

  .pi {
    color: $gray;
  }
}

.input-error-msg {
  max-width: 20rem;
  margin-top: .25rem;
  font-size: .75rem;
  color: $supporting_red;
}

</style>