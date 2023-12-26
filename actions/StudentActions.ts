'use server';

import supabaseClient from '@/lib/supabase-client';
import { getSession } from './AuthActions';
import { Database } from '@/types_db';
import { isAdvisorAuthorized, isSuperUser } from '@/lib/utils/dbUtils';
import { ActionResponse, ProcessDetails } from '@/types';
import { responseError, responseOk } from '@/lib/utils/Utils';

export async function getStudent(student_no: number | string) {
	const { data, error } = await supabaseClient
		.from('students')
		.select()
		.eq('no', student_no)
		.maybeSingle();

	if (error || !data) return null;

	return data;
}

export async function getStudents() {
	const session = await getSession();

	if (!session) {
		return null;
		// return responseError('Not authorized');
	}

	const { data, error } = await supabaseClient.from('students').select();

	if (error) {
		return null;
		// return responseError();
	}

	return data;
}

export async function createStudent(
	no: number,
	name: string,
	surname: string,
	email: string,
	department: Database['public']['Enums']['Department']
): Promise<ActionResponse> {
	const session = await getSession();

	if (!session) {
		return responseError('Not authorized');
	}

	// error if advisor has no department or does not match with new student
	let advisor_department = session.advisor.department;
	if (
		!isSuperUser(session) &&
		(!advisor_department || advisor_department != department)
	) {
		return responseError("You can't interact with this department");
	}

	const { error: insert_error } = await supabaseClient
		.from('students')
		.insert({
			no: no,
			name: name,
			surname: surname,
			email: email,
			department: department,
		});

	if (insert_error) {
		return responseError();
	}

	return responseOk();
}

export async function deleteStudent(no: number): Promise<ActionResponse> {
	const session = await getSession();

	if (!session) {
		return responseError('Not authorized');
	}

	const { data, error } = await supabaseClient
		.from('students')
		.select()
		.eq('no', no)
		.maybeSingle();

	if (error || !data) {
		return responseError('Student not found');
	}

	let is_authorized = await isAdvisorAuthorized(session, data.no);
	if (!is_authorized) {
		return responseError("You can't interact with this student");
	}

	// delete student from database
	const { error: delete_error } = await supabaseClient
		.from('students')
		.delete()
		.eq('no', no);

	if (delete_error) {
		return responseError('Student not found');
	}

	return responseOk();
}
