'use server';

import supabaseClient from '@/lib/supabase-client';
import { getSession } from './AuthActions';
import { isAdvisorAuthorized } from '@/lib/utils/dbUtils';
import { ActionResponse } from '@/types';
import { responseError, responseOk } from '@/lib/utils/Utils';

export async function createCif(
	student_no: number,
	company_name: string,
	country: string,
	intern_start_date: Date,
	intern_end_date: Date,
	file_path: string
): Promise<ActionResponse> {
	const session = await getSession();

	if (!session) {
		return responseError('Not authorized');
	}

	let is_authorized = await isAdvisorAuthorized(session, student_no);
	if (!is_authorized) {
		return responseError("You can't interact with this student");
	}

	const { error } = await supabaseClient.from('cifs').insert({
		student_no: student_no,
		company_name: company_name,
		country: country,
		intern_start_date: intern_start_date.toISOString(),
		intern_end_date: intern_end_date.toISOString(),
		pdf_path: file_path,
	});

	if (error) {
		return responseError();
	}

	return responseOk();
}

export async function deleteCif(id: number): Promise<ActionResponse> {
	const session = await getSession();

	if (!session) {
		return responseError('Not authorized');
	}

	// get cif from database
	const { data: cif_data, error: cif_error } = await supabaseClient
		.from('cifs')
		.select()
		.eq('id', id)
		.maybeSingle();

	if (cif_error || !cif_data) {
		return responseError('CIF not found');
	}

	let is_authorized = await isAdvisorAuthorized(session, cif_data.student_no);
	if (!is_authorized) {
		return responseError("You can't interact with this student");
	}

	// delete cif from database
	const { error: delete_error } = await supabaseClient
		.from('cifs')
		.delete()
		.eq('id', id);

	if (delete_error) {
		return responseError('CIF not found');
	}

	return responseOk();
}

export async function updateCif(
	id: number,
	accept_status: boolean
): Promise<ActionResponse> {
	const session = await getSession();

	if (!session) {
		return responseError('Not authorized');
	}

	// get cif from database
	const { data: cif_data, error: cif_error } = await supabaseClient
		.from('cifs')
		.select()
		.eq('id', id)
		.maybeSingle();

	if (cif_error || !cif_data) {
		return responseError('CIF not found');
	}

	let is_authorized = await isAdvisorAuthorized(session, cif_data.student_no);
	if (!is_authorized) {
		return responseError("You can't interact with this student");
	}

	// update cif
	const { error: update_error } = await supabaseClient
		.from('cifs')
		.update({
			is_accepted: accept_status,
		})
		.eq('id', id);

	if (update_error) {
		return responseError('CIF not found');
	}

	return responseOk();
}
