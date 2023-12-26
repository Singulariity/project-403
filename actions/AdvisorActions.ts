'use server';

import supabaseClient from '@/lib/supabase-client';
import { Database } from '@/types_db';
import { hash } from 'bcrypt';
import { getSession } from './AuthActions';
import { isSuperUser } from '@/lib/utils/dbUtils';
import { ActionResponse } from '@/types';
import { responseError, responseOk } from '@/lib/utils/Utils';

export async function createAdvisor(
	username: string,
	password: string,
	name: string,
	surname: string,
	department?: Database['public']['Enums']['Department']
): Promise<ActionResponse> {
	const session = await getSession();

	if (!session || !isSuperUser(session)) {
		return responseError('Not authorized');
	}

	// get new advisor data from database to check if they already exists
	const { data, error } = await supabaseClient
		.from('advisors')
		.select()
		.eq('username', username)
		.maybeSingle();

	if (error) {
		return responseError();
	}

	if (data) {
		return responseError('Advisor with given username is already exists');
	}

	// generate hashed password
	let hashedPassword = await hash(password, 12);

	// insert new user to the database
	const { error: insert_error } = await supabaseClient
		.from('advisors')
		.insert({
			username: username,
			name: name,
			surname: surname,
			password: hashedPassword,
			department: department || null,
		});

	if (insert_error) {
		return responseError();
	}

	return responseOk();
}

export async function deleteAdvisor(username: string): Promise<ActionResponse> {
	const session = await getSession();

	if (!session || !isSuperUser(session)) {
		return responseError('Not authorized');
	}

	// self-delete check
	if (username == session.advisor.username) {
		return responseError('Are you just tried to delete yourself...?');
	}

	// delete advisor from database
	const { error } = await supabaseClient
		.from('advisors')
		.delete()
		.eq('username', username);

	if (error) {
		return responseError('Advisor with given username does not exist');
	}

	return responseOk();
}
