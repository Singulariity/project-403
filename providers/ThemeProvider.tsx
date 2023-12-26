'use client';

import { ConfigProvider, theme } from 'antd';

interface Props {
	template: 'dark' | 'light';
	children: React.ReactNode;
}

export default function ThemeProvider({ template, children }: Props) {
	return (
		<ConfigProvider
			theme={{
				algorithm:
					template == 'dark'
						? theme.darkAlgorithm
						: theme.defaultAlgorithm,
			}}
		>
			{children}
		</ConfigProvider>
	);
}
