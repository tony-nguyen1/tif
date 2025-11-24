export enum FormState {
	AddSet,
	Hide,
	EditSet,
	EditWorkoutInfo,
	AddTag
}

export type FormStateStrings = keyof typeof FormState;
