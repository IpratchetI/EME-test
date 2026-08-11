import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { FeedbackFormValues, FeedbackStatus, FeedbackSubmission } from '@/types/feedback'

const STORAGE_KEY = 'eme-feedback-submissions'

function loadSubmissions(): FeedbackSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as FeedbackSubmission[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(submissions: FeedbackSubmission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions))
}

async function mockSend(payload: FeedbackFormValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 900))

  if (payload.email.toLowerCase().includes('fail@')) {
    throw new Error('Mock API error')
  }
}

export const useFeedbackStore = defineStore('feedback', () => {
  const status = ref<FeedbackStatus>('idle')
  const errorMessage = ref('')
  const submissions = ref<FeedbackSubmission[]>(loadSubmissions())

  function resetStatus() {
    status.value = 'idle'
    errorMessage.value = ''
  }

  async function submit(values: FeedbackFormValues) {
    status.value = 'submitting'
    errorMessage.value = ''

    try {
      await mockSend(values)

      const entry: FeedbackSubmission = {
        ...values,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      submissions.value = [entry, ...submissions.value]
      persist(submissions.value)
      status.value = 'success'
    } catch (error) {
      status.value = 'error'
      errorMessage.value =
        error instanceof Error ? error.message : 'Не удалось отправить форму'
    }
  }

  return {
    status,
    errorMessage,
    submissions,
    submit,
    resetStatus,
  }
})
