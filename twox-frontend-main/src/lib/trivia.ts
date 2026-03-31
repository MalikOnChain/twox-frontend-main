export enum QUESTION_TYPE {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_IN_THE_BLANK = 'fill_in_the_blank',
  TRUE_FALSE = 'true_false',
}

export enum TRIVIA_RESULT_MESSAGE {
  closed = 'Trivia Closed',
  correct = 'Your answer is correct',
  incorrect = 'Your answer is incorrect',
  already_answered = 'You have already answered this question',
  expired = 'This trivia has expired',
}
