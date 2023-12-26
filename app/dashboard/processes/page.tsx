import { getSession } from '@/actions/AuthActions';
import { Alert } from 'antd';
import { redirect } from 'next/navigation';
import FindStudentForm from './components/FindStudentForm';

export default async function Page() {
	const session = await getSession();

	if (!session) {
		redirect('/');
	}

	return (
		<>
			<Alert
				message="To start the process for a student, simply create the student from 'Students' tab."
				type="info"
			/>
			<div className="mt-4">
				<FindStudentForm />
			</div>
		</>
	);
}
