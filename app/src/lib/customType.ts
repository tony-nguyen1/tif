export const goalEnum = ['cutting', 'bulking', 'maintaining', 'cardio', 'strength'] as const;
export type Goal = (typeof goalEnum)[number];
