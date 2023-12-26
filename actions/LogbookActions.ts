'use server';

import { isAdvisorAuthorized } from '@/lib/utils/dbUtils';
import { getSession } from './AuthActions';
import { getStudent } from './StudentActions';
import supabaseClient from '@/lib/supabase-client';
import { ActionResponse } from '@/types';
import { responseError, responseOk } from '@/lib/utils/Utils';

export async function giveLogbook(student_no: number): Promise<ActionResponse> {
	const session = await getSession();

	if (!session) {
		return responseError('Not authorized');
	}

	const student = await getStudent(student_no);

	if (!student) {
		return responseError('Student not found');
	}

	let is_authorized = await isAdvisorAuthorized(session, student_no);
	if (!is_authorized) {
		return responseError("You can't interact with this student");
	}

	const { error } = await supabaseClient.from('logbooks').insert({
		student_no: student.no,
	});

	if (error) {
		return responseError();
	}

	return responseOk();
}

export async function acceptLogbook(
	student_no: number
): Promise<ActionResponse> {
	const session = await getSession();

	if (!session) {
		return responseError('Not authorized');
	}

	const student = await getStudent(student_no);

	if (!student) {
		return responseError('Student not found');
	}

	let is_authorized = await isAdvisorAuthorized(session, student_no);
	if (!is_authorized) {
		return responseError("You can't interact with this student");
	}

	const { error } = await supabaseClient
		.from('logbooks')
		.update({
			is_accepted: true,
			submit_date: new Date().toISOString(),
		})
		.eq('student_no', student.no);

	if (error) {
		return responseError();
	}

	return responseOk();
}
