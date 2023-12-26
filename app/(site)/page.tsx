import { getSession } from '@/actions/AuthActions';
import { redirect } from 'next/navigation';
import AuthContent from './components/AuthContent';

export default async function Home() {
	const session = await getSession();

	// redirect to dashboard if there is a session
	if (session) redirect('/dashboard');

	return <AuthContent />;
}
