import { getSession } from '@/actions/AuthActions';
import { redirect } from 'next/navigation';

import DashboardLayoutContent from './components/DashboardLayoutContent';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	// redirect to homepage if there's no session
	if (!session) redirect('/');

	return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
