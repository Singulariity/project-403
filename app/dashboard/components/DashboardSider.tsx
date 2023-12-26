'use client';

import { Layout, Menu } from 'antd';
import {
	BarChartOutlined,
	BookOutlined,
	HomeOutlined,
	LogoutOutlined,
	MailOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/actions/AuthActions';

const { Sider } = Layout;

interface SiderProps {
	collapsed: boolean;
}

export default function DashboardSider({ collapsed }: SiderProps) {
	const router = useRouter();
	const path = usePathname().split('/');

	// logout function
	async function logoutHandler() {
		try {
			let res = await logout();
			if (res.ok) {
				router.refresh();
			}
		} catch (error: any) {}
	}

	return (
		<Sider
			style={{
				height: '100vh',
			}}
			trigger={null}
			collapsible
			collapsed={collapsed}
		>
			<div className="demo-logo-vertical" />
			<Menu
				theme="dark"
				mode="inline"
				selectedKeys={[path[path.length - 1]]}
				items={[
					{
						key: 'dashboard',
						icon: <HomeOutlined />,
						label: 'Home',
						onClick: () => router.push('/dashboard'),
					},
					{
						key: 'advisors',
						icon: <UserOutlined />,
						label: 'Advisors',
						onClick: () => router.push('/dashboard/advisors'),
					},
					{
						key: 'students',
						icon: <BookOutlined />,
						label: 'Students',
						onClick: () => router.push('/dashboard/students'),
					},
					{
						key: 'cifs',
						icon: <MailOutlined />,
						label: 'Company Info Forms',
						onClick: () => router.push('/dashboard/cifs'),
					},
					{
						key: 'processes',
						icon: <BarChartOutlined />,
						label: 'Processes',
						onClick: () => router.push('/dashboard/processes'),
					},
					{
						key: '10',
						danger: true,
						icon: <LogoutOutlined />,
						label: 'Logout',
						onClick: logoutHandler,
					},
				]}
			/>
		</Sider>
	);
}
