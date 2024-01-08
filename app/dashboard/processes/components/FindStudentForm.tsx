'use client';

import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';

export default function FindStudentForm() {
	const [form] = Form.useForm();
	const router = useRouter();
	const [messageApi, contextHolder] = message.useMessage();

	async function finishHandler(values: any) {
		try {
			router.push('/dashboard/processes/' + values.no);
		} catch (error: any) {
			messageApi.error(error.message);
		}
	}

	return (
		<>
			{contextHolder}
			<Form
				form={form}
				layout="vertical"
				className="w-[300px] mx-auto mt-8"
				onFinish={finishHandler}
			>
				<Form.Item label="Student No" name="no">
					<Input />
				</Form.Item>
				<Form.Item>
					<Button type="default" htmlType="submit">
						Search
					</Button>
				</Form.Item>
			</Form>
		</>
	);
}
