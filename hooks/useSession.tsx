'use client';
import { getSession } from '@/actions/AuthActions';
import { SessionDetails } from '@/types';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

type SessionContextType = {
	session: SessionDetails | null;
	isLoading: boolean;
};

export const SessionContext = createContext<SessionContextType | undefined>(
	undefined
);

interface Props {
	children: React.ReactNode;
}

export function MySessionContextProvider({ children }: Props) {
	const [session, setSession] = useState<SessionDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const path = usePathname();

	useEffect(() => {
		updateSession();
	}, [path]);

	function updateSession() {
		try {
			getSession().then((session) => {
				if (session) {
					setSession(session);
				}
				setIsLoading(false);
			});
		} catch (error: any) {}
	}

	const value = {
		session,
		isLoading,
	};

	return (
		<SessionContext.Provider value={value}>
			{children}
		</SessionContext.Provider>
	);
}

export function useSession() {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error(
			'useSession must be used within a MySessionContextProvider'
		);
	}

	return context;
}
