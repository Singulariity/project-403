import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import UserProvider from '@/providers/UserProvider';
import { ConfigProvider, theme } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import ThemeProvider from '@/providers/ThemeProvider';

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Project 403',
	description: 'Lorem ipsum',
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
					<StyledComponentsRegistry>
						<ConfigProvider locale={enUS}>
							<ThemeProvider template="dark">
								{children}
							</ThemeProvider>
						</ConfigProvider>
					</StyledComponentsRegistry>
				</UserProvider>
			</body>
		</html>
	);
}
