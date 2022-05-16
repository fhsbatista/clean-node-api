export interface AddSurveyModel {
  question: string
  answers: AnswerModel[]
}

export interface AnswerModel {
  image?: string
  answer: string
}

export interface AddSurvey {
  add (survey: AddSurveyModel): Promise<void>
}
