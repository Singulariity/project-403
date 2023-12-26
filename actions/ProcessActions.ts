'use server';

import supabaseClient from '@/lib/supabase-client';
import { ActionResponse, ProcessDetails } from '@/types';
import { getSession } from './AuthActions';
import { getStudent } from './StudentActions';
import { isAdvisorAuthorized } from '@/lib/utils/dbUtils';
import { responseError, responseOk } from '@/lib/utils/Utils';

export async function getProcess(
	student_no: number | string
): Promise<ProcessDetails | null> {
	/* 	const session = await getSession();

	if (!session) {
		return responseError('Not authorized');
	} */

	const { data: student_data, error: student_error } = await supabaseClient
		.from('students')
		.select()
		.eq('no', student_no)
		.maybeSingle();

	if (student_error || !student_data) {
		return null;
	}

	let obj = {
		student: student_data,
	} as any;

	// check cif stage
	const { data: cif_data, error: cif_error } = await supabaseClient
		.from('cifs')
		.select()
		.eq('student_no', student_no)
		.eq('is_accepted', true)
		.maybeSingle();

	if (cif_error || !cif_data) {
		obj.stage = 'CIF';
		return obj;
	}

	// check logbook stage
	const { data: logbook_data, error: logbook_error } = await supabaseClient
		.from('logbooks')
		.select()
		.eq('student_no', student_no)
		.maybeSingle();

	if (logbook_error || !logbook_data) {
		obj.stage = 'LOGBOOK';
		return obj;
	}

	// check submit report stage
	const { data: submit_report_data, error: submit_report_error } =
		await supabaseClient
			.from('logbooks')
			.select()
			.eq('student_no', student_no)
			.eq('is_accepted', true)
			.maybeSingle();

	if (submit_report_error || !submit_report_data) {
		obj.stage = 'SUBMIT_REPORT';
		return obj;
	}

	// check oral exam stage
	const { data, error } = await supabaseClient
		.from('oral_exams')
		.select()
		.eq('student_no', student_no)
		.eq('is_accepted', true)
		.maybeSingle();

	if (error || !data) {
		obj.stage = 'ORAL_EXAM';
		return obj;
	}

	obj.stage = 'FINISHED';
	return obj;
}

export async function finishProcess(
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

	const { error: insert_error } = await supabaseClient
		.from('oral_exams')
		.insert({
			student_no: student_no,
			date: new Date().toISOString(),
			is_accepted: true,
		});

	if (insert_error) {
		return responseError();
	}

	const { error } = await supabaseClient
		.from('students')
		.update({
			finished_at: new Date().toISOString(),
		})
		.eq('no', student_no);

	if (error) {
		return responseError();
	}

	return responseOk();
}
