import { fail, type Actions } from '@sveltejs/kit';
import { _requireLogin } from '../workout/+page.server';
import { addTagToUser, getTagOfUser } from '$lib/server/db/tagRepo';

export async function load() {
	const user = _requireLogin();
	const tagUserAll = await getTagOfUser(user.id);

	return { tagUserAll };
}

export const actions: Actions = {
	createTag: async ({ request }) => {
		const user = _requireLogin();
		const data = await request.formData();
		const tag = {
			name: data.get('newTagName')!.toString(),
			userId: user.id
		};

		try {
			const res = await addTagToUser(tag);
			if (res.length === 1) {
				return {
					success: true,
					message:
						res.length === 1
							? 'Tag has been inserted into db'
							: `Error creating the tag ${tag.name} `,
					tagName: tag.name
				};
			}

			return fail(500, {
				success: false,
				message: `Error creating the tag ${tag.name} `,
				tagName: tag.name
			});
		} catch (error) {
			console.error(error);
			return fail(500, {
				success: false,
				message: `Error creating the tag ${tag.name} `,
				tagName: tag.name
			});
		}
	}
};
