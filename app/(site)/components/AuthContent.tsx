'use client';

import { login } from '@/actions/AuthActions';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
	LoginFormPage,
	ProConfigProvider,
	ProFormText,
} from '@ant-design/pro-components';
import { Tabs, message, theme } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type LoginType = 'advisor' | 'student';

const Page = () => {
	const [loginType, setLoginType] = useState<LoginType>('advisor');
	const { token } = theme.useToken();
	const [messageApi, contextHolder] = message.useMessage();
	const router = useRouter();

	// submit handler function
	async function submitHandler(data: any) {
		let username = data.username;
		let password = data.password;
		let student_no = data.student_no;

		if (username && password) {
			try {
				let res = await login(username, password);
				if (res.ok) {
					router.refresh();
				} else {
					messageApi.error(res.error);
				}
			} catch (error: any) {
				messageApi.error(error.message);
			}
		} else if (student_no) {
			router.push(`/info/${student_no}`);
		}
	}

	return (
		<div
			style={{
				backgroundColor: 'black',
				height: '100vh',
			}}
		>
			{contextHolder}
			<LoginFormPage
				backgroundImageUrl="https://i.imgur.com/4CIe1Nn.jpg"
				backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
				title="Login"
				containerStyle={{
					backgroundColor: 'rgba(0, 0, 0,0.65)',
					backdropFilter: 'blur(4px)',
				}}
				subTitle="..."
				onFinish={submitHandler}
			>
				<Tabs
					centered
					activeKey={loginType}
					onChange={(activeKey) =>
						setLoginType(activeKey as LoginType)
					}
				>
					<Tabs.TabPane key={'advisor'} tab={'Advisor'} />
					<Tabs.TabPane key={'student'} tab={'Student'} />
				</Tabs>
				{loginType === 'advisor' && (
					<>
						<ProFormText
							name="username"
							fieldProps={{
								size: 'large',
								prefix: (
									<UserOutlined
										style={{
											color: token.colorText,
										}}
										className={'prefixIcon'}
									/>
								),
							}}
							placeholder={'Username'}
							rules={[
								{
									required: true,
									message: 'This field is required!',
								},
							]}
						/>
						<ProFormText.Password
							name="password"
							fieldProps={{
								size: 'large',
								prefix: (
									<LockOutlined
										style={{
											color: token.colorText,
										}}
										className={'prefixIcon'}
									/>
								),
							}}
							placeholder={'Password'}
							rules={[
								{
									required: true,
									message: 'This field is required!',
								},
							]}
						/>
					</>
				)}
				{loginType === 'student' && (
					<>
						<ProFormText
							name="student_no"
							fieldProps={{
								size: 'large',
								prefix: (
									<UserOutlined
										style={{
											color: token.colorText,
										}}
										className={'prefixIcon'}
									/>
								),
							}}
							placeholder={'Student Number'}
							rules={[
								{
									required: true,
									message: 'This field is required!',
								},
							]}
						/>
					</>
				)}
			</LoginFormPage>
		</div>
	);
};

export default () => {
	return (
		<ProConfigProvider dark>
			<Page />
		</ProConfigProvider>
	);
};
