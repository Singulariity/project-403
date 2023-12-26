import supabaseClient from '@/lib/supabase-client';
import { getSession } from '@/actions/AuthActions';
import { redirect } from 'next/navigation';
import StudentsTable from './components/StudentsTable';
import CreateStudentForm from './components/CreateStudentForm';

export default async function Page() {
	const session = await getSession();

	if (!session) {
		redirect('/');
	}

	const { data, error } = await supabaseClient.from('students').select();

	if (error || !data) return null;

	return (
		<>
			<StudentsTable data={data} />
			<b>Create Student</b>
			<CreateStudentForm />
		</>
	);
}
