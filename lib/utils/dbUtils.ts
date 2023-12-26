import { SessionDetails } from '@/types';
import supabaseClient from '../supabase-client';

export function isSuperUser(session?: SessionDetails | null) {
	return session && session.advisor.username == process.env.SUPER_USER_ID;
}

export async function isAdvisorAuthorized(
	session: SessionDetails,
	student_no: number
) {
	const { data, error } = await supabaseClient
		.from('students')
		.select()
		.eq('no', student_no)
		.maybeSingle();

	if (error || !data) {
		return false;
	}

	// if advisor has no department or does not match with new student
	let advisor_department = session.advisor.department;
	if (
		!isSuperUser(session) &&
		(!advisor_department || advisor_department != data.department)
	) {
		return false;
	}

	return true;
}
