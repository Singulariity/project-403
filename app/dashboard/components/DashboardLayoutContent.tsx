'use client';

import { Layout, theme } from 'antd';
import DashboardSider from './DashboardSider';

const { Header, Content, Footer } = Layout;

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayoutContent({
	children,
}: DashboardLayoutProps) {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	return (
		<Layout hasSider>
			<DashboardSider />
			<Layout style={{ marginLeft: 200, minHeight: '100vh' }}>
				<Header style={{ padding: 0 }} />
				<Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
					<div
						style={{
							padding: 24,
							textAlign: 'center',
							background: colorBgContainer,
							borderRadius: borderRadiusLG,
						}}
					>
						{children}
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					Internship Follow System ©2023 Created by GAU
				</Footer>
			</Layout>
		</Layout>
	);
}
