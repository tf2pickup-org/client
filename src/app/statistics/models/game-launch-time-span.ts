type TimeOfTheDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GameLaunchTimeSpan {
  dayOfWeek: number; // day of the week as a number between 1 (Sunday) and 7 (Saturday)
  timeOfTheDay: TimeOfTheDay;
  count: number;
}
