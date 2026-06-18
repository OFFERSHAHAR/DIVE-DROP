/**
 * Types for Perfect Day Agent feature
 */

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'instructor'
export type DiveGoal = 'new_site' | 'improve_skills' | 'social' | 'explore'
export type GuidePreference = 'yes' | 'no' | 'surprise'

export interface PerfectDayAnswers {
  experienceLevel: ExperienceLevel
  goal: DiveGoal
  guidePreference: GuidePreference
}

export interface DivePlan {
  siteId: string
  siteName: string
  siteDepth: number
  siteDifficulty: string
  siteLocation: string
  instructors: Array<{ id: string; firstName: string; lastName: string }>
  message: string // Claude-written personalized message
  tips: string[]
}

export interface PerfectDayWidgetState {
  status: 'idle' | 'questions' | 'loading' | 'result' | 'error'
  currentQuestion: 0 | 1 | 2
  answers: Partial<PerfectDayAnswers>
  plan: DivePlan | null
  error: string | null
}
