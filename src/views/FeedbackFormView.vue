<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { useFeedbackStore } from '@/stores/feedback'

const store = useFeedbackStore()

const schema = toTypedSchema(
  yup.object({
    name: yup
      .string()
      .trim()
      .required('Укажите имя')
      .min(2, 'Минимум 2 символа')
      .max(60, 'Максимум 60 символов'),
    email: yup
      .string()
      .trim()
      .required('Укажите email')
      .email('Некорректный email'),
    message: yup
      .string()
      .trim()
      .required('Напишите сообщение')
      .min(10, 'Минимум 10 символов')
      .max(500, 'Максимум 500 символов'),
  }),
)

const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    message: '',
  },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: message, errorMessage: messageError } = useField<string>('message')

const isSubmitting = computed(() => store.status === 'submitting')
const isSuccess = computed(() => store.status === 'success')
const isError = computed(() => store.status === 'error')

watch([name, email, message], () => {
  if (store.status === 'success' || store.status === 'error') {
    store.resetStatus()
  }
})

const onSubmit = handleSubmit(async (values) => {
  await store.submit(values)
  if (store.status === 'success') {
    resetForm()
  }
})

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
</script>

<template>
  <section class="page">
    <div class="page__header">
      <h2 class="page__title">Форма обратной связи</h2>
      <p class="page__subtitle">
        VeeValidate + Yup, состояния формы в Pinia, отправка на mock API и запись в
        localStorage. Для ошибки введите email вида
        <code>fail@example.com</code>.
      </p>
    </div>

    <div class="feedback">
      <form class="panel feedback__form" @submit.prevent="onSubmit">
        <label class="field">
          <span class="field__label">Имя</span>
          <input
            v-model="name"
            class="field__control"
            :class="{ 'field__control--error': nameError }"
            type="text"
            autocomplete="name"
            placeholder="Анна"
          />
          <span v-if="nameError" class="field__error">{{ nameError }}</span>
        </label>

        <label class="field">
          <span class="field__label">Email</span>
          <input
            v-model="email"
            class="field__control"
            :class="{ 'field__control--error': emailError }"
            type="email"
            autocomplete="email"
            placeholder="anna@example.com"
          />
          <span v-if="emailError" class="field__error">{{ emailError }}</span>
        </label>

        <label class="field">
          <span class="field__label">Сообщение</span>
          <textarea
            v-model="message"
            class="field__control"
            :class="{ 'field__control--error': messageError }"
            placeholder="Расскажите, что можно улучшить..."
          />
          <span v-if="messageError" class="field__error">{{ messageError }}</span>
        </label>

        <div class="feedback__status" aria-live="polite">
          <p v-if="isSubmitting" class="status status--pending">Отправка...</p>
          <p v-else-if="isSuccess" class="status status--success">
            Сообщение отправлено и сохранено локально.
          </p>
          <p v-else-if="isError" class="status status--error">
            Ошибка: {{ store.errorMessage }}
          </p>
          <p v-else class="status status--idle">
            Состояние: по умолчанию
            <span v-if="meta.dirty">· форма изменена</span>
          </p>
        </div>

        <button type="submit" class="btn btn--primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Отправляем...' : 'Отправить' }}
        </button>
      </form>

      <aside class="panel feedback__history">
        <h3>Сохранённые отправки</h3>
        <p class="feedback__history-hint">Данные из localStorage</p>

        <ul v-if="store.submissions.length" class="feedback__list">
          <li v-for="item in store.submissions" :key="item.id">
            <strong>{{ item.name }}</strong>
            <span>{{ item.email }}</span>
            <p>{{ item.message }}</p>
            <time>{{ formatDate(item.createdAt) }}</time>
          </li>
        </ul>
        <p v-else class="feedback__empty">Пока нет сохранённых сообщений.</p>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.feedback {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: 1rem;
  align-items: start;
}

.feedback__form {
  display: grid;
  gap: 1rem;
}

.feedback__status .status {
  font-size: 0.92rem;
}

.status--idle {
  color: $color-muted;
}

.status--pending {
  color: $color-warn;
}

.status--success {
  color: $color-success;
}

.status--error {
  color: $color-danger;
}

.feedback__history {
  display: grid;
  gap: 0.75rem;
}

.feedback__history h3 {
  font-size: 1.05rem;
}

.feedback__history-hint,
.feedback__empty {
  color: $color-muted;
  font-size: 0.9rem;
}

.feedback__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.feedback__list li {
  display: grid;
  gap: 0.25rem;
  padding: 0.8rem;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  background: rgba(243, 247, 249, 0.7);
}

.feedback__list span,
.feedback__list time {
  color: $color-muted;
  font-size: 0.85rem;
}

.feedback__list p {
  color: $color-ink-soft;
  line-height: 1.45;
  word-break: break-word;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
  background: $color-accent-soft;
  padding: 0.1em 0.35em;
  border-radius: 6px;
}

@media (max-width: 900px) {
  .feedback {
    grid-template-columns: 1fr;
  }
}
</style>
