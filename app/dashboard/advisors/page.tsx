import supabaseClient from '@/lib/supabase-client';
import AdvisorsTable from './components/AdvisorsTable';
import { getSession } from '@/actions/AuthActions';
import { redirect } from 'next/navigation';
import CreateAdvisorForm from './components/CreateAdvisorForm';
import { UserDetails } from '@/types';

export default async function Page() {
	const session = await getSession();

	if (!session) {
		redirect('/');
	}

	const { data, error } = await supabaseClient.from('advisors').select();

	if (error || !data) return null;

	let arr: UserDetails[] = [];
	for (let i = 0; i < data.length; i++) {
		arr.push({
			username: data[i].username,
			name: data[i].name,
			surname: data[i].surname,
			department: data[i].department,
		});
	}

	return (
		<>
			<AdvisorsTable data={arr} />
			<h1>Create Advisor</h1>
			<CreateAdvisorForm />
		</>
	);
}
