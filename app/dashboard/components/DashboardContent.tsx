'use client';

import { useSession } from '@/hooks/useSession';
import { getDepartmentText } from '@/lib/utils/Utils';

export default function DashboardContent() {
	const { session } = useSession();

	// TODO dashboard content
	return (
		<>
			Welcome{' '}
			<b>
				{session?.advisor.name} {session?.advisor.surname}
			</b>
			<br />
			<br />
			Your department is{' '}
			<b>{getDepartmentText(session?.advisor.department)}</b>
		</>
	);
}
