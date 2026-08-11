export type FeedbackStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface FeedbackFormValues {
  name: string
  email: string
  message: string
}

export interface FeedbackSubmission extends FeedbackFormValues {
  id: string
  createdAt: string
}
