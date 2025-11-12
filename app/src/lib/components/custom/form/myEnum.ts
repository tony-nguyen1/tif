export enum FormState {
	Display,
	Hide,
	EditSet,
	EditWorkoutInfo
}

export type FormStateStrings = keyof typeof FormState;
