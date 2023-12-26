'use client';

import { login } from '@/actions/AuthActions';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function AuthContent() {
	const [messageApi, contextHolder] = message.useMessage();
	const router = useRouter();

	// login function
	async function loginHandler(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		let username = data.get('username')?.toString();
		let password = data.get('password')?.toString();

		try {
			let res = await login(username!, password!);
			if (res.ok) {
				router.refresh();
			} else {
				messageApi.error(res.error);
			}
		} catch (error: any) {
			messageApi.error(error.message);
		}
	}

	// student info function
	function studentInfo(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		let student_no = data.get('student_no')?.toString();

		if (!student_no) return;

		router.push(`/info/${student_no}`);
	}

	return (
		<>
			{contextHolder}
			<div className="flex w-1/2 mx-auto mt-24">
				<div className="login">
					<form onSubmit={loginHandler}>
						<br />
						<br />
						<h1>
							<center>Advisor Login</center>
						</h1>
						<br />
						<br />
						<br />
						<br />
						<label htmlFor="username">Username:</label>
						<br />
						<input type="text" id="username" name="username" />
						<br />
						<br />
						<label htmlFor="password">Password:</label>
						<br />
						<input type="password" id="password" name="password" />
						<br />
						<br />
						<br />
						<br />
						<button type="submit">Login</button>
					</form>
				</div>

				<div className="login">
					<form onSubmit={studentInfo}>
						<br />
						<br />
						<h1>
							<center>Student Process Check</center>
						</h1>
						<br />
						<br />
						<br />
						<br />
						<label htmlFor="student_no">Student Number:</label>
						<br />
						<input type="text" id="student_no" name="student_no" />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<button type="submit">Check</button>
					</form>
				</div>
			</div>
		</>
	);
}
