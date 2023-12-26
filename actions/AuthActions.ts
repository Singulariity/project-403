'use server';

import supabaseClient from '@/lib/supabase-client';
import { ActionResponse, SessionDetails } from '@/types';
import {
	dateToPostgre,
	isDatePassed,
	postgreToDate,
	responseError,
	responseOk,
} from '@/lib/utils/Utils';
import { cookies } from 'next/headers';
import { compare } from 'bcrypt';
import { isSuperUser } from '@/lib/utils/dbUtils';

export async function getSession(): Promise<SessionDetails | null> {
	// get session token from user cookies
	const token = cookies().get('session')?.value;

	// return null if there's no session
	if (!token) return null;

	// return session with given token from database
	const { data, error } = await supabaseClient
		.from('sessions')
		.select()
		.eq('token', token)
		.maybeSingle();

	// return null if session is not valid
	if (error || !data) return null;

	// return null if session expired
	// delete session from database
	let js_date = postgreToDate(data.expires_at);
	if (isDatePassed(js_date)) {
		await supabaseClient.from('sessions').delete().eq('token', data.token);
		return null;
	}

	// get advisor from session
	const { data: ad_data, error: ad_error } = await supabaseClient
		.from('advisors')
		.select()
		.eq('username', data.advisor_username)
		.maybeSingle();

	// return null if session doesn't match with the advisor
	if (ad_error || !ad_data) return null;

	// extend session
	let new_expire_date = await extendSession(data.token);

	// return data
	return {
		advisor: {
			username: ad_data.username,
			name: ad_data.name,
			surname: ad_data.surname,
			department: ad_data.department,
		},
		is_admin: ad_data.username == process.env.SUPER_USER_ID,
		expires_at: new_expire_date,
		token: data.token,
	};
}

// extends the session and returns the new expire Date
async function extendSession(token: string) {
	let new_millis = Date.now() + 1000 * 60 * 60;
	let new_timestamp = dateToPostgre(new_millis);

	await supabaseClient
		.from('sessions')
		.update({ expires_at: new_timestamp })
		.eq('token', token);

	return new Date(new_millis);
}

export async function login(
	username: string,
	password: string
): Promise<ActionResponse> {
	const session = await getSession();

	if (session) {
		return responseError('Already logged in');
	}

	// get advisor from database with given username
	const { data, error } = await supabaseClient
		.from('advisors')
		.select()
		.eq('username', username)
		.maybeSingle();

	let isSuperUserLogin =
		username == process.env.SUPER_USER_ID &&
		password == process.env.SUPER_USER_PASS;

	if (!isSuperUserLogin) {
		// wrong id or password
		if (error || !data || !(await compare(password, data!.password))) {
			return responseError('Invalid username or password');
		}
	}

	if (!data) {
		return responseError();
	}

	// generate random session token
	let sessionToken = crypto.randomUUID();

	// set expires date to 1 hour after
	let expires = dateToPostgre(Date.now() + 1000 * 60 * 60);

	// put session to database
	const { error: error_ } = await supabaseClient.from('sessions').insert({
		advisor_username: username,
		expires_at: expires,
		token: sessionToken,
	});

	if (error_) {
		return responseError();
	}

	// finally, set user's session cookie
	cookies().set('session', sessionToken);

	return responseOk();
}

export async function logout(): Promise<ActionResponse> {
	const session = await getSession();

	// check if user is logged in
	if (!session) {
		return responseError('Not logged in');
	}

	// delete session from database
	await supabaseClient.from('sessions').delete().eq('token', session.token);

	// then delete session cookie of the user
	cookies().delete('session');

	return responseOk();
}
