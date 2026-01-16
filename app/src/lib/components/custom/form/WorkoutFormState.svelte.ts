import { FormState } from './myEnum';
import type { Set } from '$lib/server/db/schema';

export class FormStateUnion {
	formState: FormState;
	setState: Set | null;
	selectedExerciseId: number;
	lastExerciseId: number;

	constructor(n: number) {
		this.formState = $state(FormState.AddSet);
		this.setState = $state(null);
		this.selectedExerciseId = $state(n);
		this.lastExerciseId = $state(n);
	}

	edit(getASet: () => Set) {
		this.formState = FormState.EditSet;
		this.setState = getASet();
		this.selectedExerciseId = getASet().exerciseId;
	}

	mutateFormDisplayStateTo(newSate: FormState) {
		if (this.formState === FormState.EditSet) {
			// in the state EditSet, the exercice selected is modified, so we need to revert it back
			this.selectedExerciseId = this.lastExerciseId;
		}
		this.formState = newSate;
	}
}
