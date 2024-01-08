import { getSession } from '@/actions/AuthActions';
import { redirect } from 'next/navigation';
import CreateCifForm from './components/CreateCifForm';
import CifsTable from './components/CifsTable';
import supabaseClient from '@/lib/supabase-client';

export default async function CIFPage() {
	const session = await getSession();

	if (!session) {
		redirect('/');
	}

	const { data, error } = await supabaseClient.from('cifs').select();

	if (error || !data) return null;

	return (
		<>
			<CifsTable data={data} />
			<div className="flex flex-col items-center">
				<h1>Create CIF</h1>
				<CreateCifForm />
			</div>
		</>
	);
}
