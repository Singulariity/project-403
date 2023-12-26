import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import UserProvider from '@/providers/UserProvider';
import { ConfigProvider, theme } from 'antd';

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'CEN403 Project', //TODO change title
	description: 'description', //TODO change description
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={font.className}>
				<UserProvider>
					<ConfigProvider
						theme={{
							algorithm: theme.darkAlgorithm,
						}}
					>
						{children}
					</ConfigProvider>
				</UserProvider>
			</body>
		</html>
	);
}
