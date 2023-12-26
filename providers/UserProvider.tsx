'use client';
import { MySessionContextProvider } from '@/hooks/useSession';

interface UserProviderProps {
	children: React.ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
	return <MySessionContextProvider>{children}</MySessionContextProvider>;
}

export default UserProvider;
