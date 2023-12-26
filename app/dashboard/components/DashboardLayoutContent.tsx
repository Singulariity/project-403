'use client';

import { Button, Layout, theme } from 'antd';
import DashboardSider from './DashboardSider';
import { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayoutContent({
	children,
}: DashboardLayoutProps) {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	return (
		<Layout hasSider>
			<DashboardSider collapsed={collapsed} />
			<Layout>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<Button
						type="text"
						icon={
							collapsed ? (
								<MenuUnfoldOutlined />
							) : (
								<MenuFoldOutlined />
							)
						}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: '16px',
							width: 64,
							height: 64,
						}}
					/>
				</Header>
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
