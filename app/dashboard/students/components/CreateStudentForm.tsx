'use client';

import { Button, Form, Input, Select, message } from 'antd';
import {
	customizedRequiredMark,
	getDepartmentText,
	getDepartments,
} from '@/lib/utils/Utils';
import { useRouter } from 'next/navigation';
import { createStudent } from '@/actions/StudentActions';

export default function CreateStudentForm() {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const router = useRouter();

	async function finishHandler(values: any) {
		try {
			let res = await createStudent(
				values.no,
				values.name,
				values.surname,
				values.email,
				values.department
			);
			if (res.ok) {
				form.resetFields();
				router.refresh();
			} else {
				messageApi.error(res.error);
			}
		} catch (error: any) {
			messageApi.error(error.message);
		}
	}

	return (
		<>
			{contextHolder}
			<Form
				className="w-1/2 mx-auto"
				form={form}
				layout="vertical"
				initialValues={{ requiredMarkValue: 'customize' }}
				requiredMark={customizedRequiredMark}
				onFinish={finishHandler}
			>
				<Form.Item name="no" label="Student Number" required>
					<Input placeholder="181701012" />
				</Form.Item>
				<Form.Item name="name" label="Name" required>
					<Input placeholder="Celestia" />
				</Form.Item>
				<Form.Item name="surname" label="Surname" required>
					<Input placeholder="Ludenberg" />
				</Form.Item>
				<Form.Item name="email" label="Email" required>
					<Input placeholder="celestia@gmail.com" />
				</Form.Item>
				<Form.Item name="department" label="Department" required>
					<Select>
						{getDepartments().map((value, i) => {
							return (
								<Select.Option value={value} key={i}>
									{getDepartmentText(value)}
								</Select.Option>
							);
						})}
					</Select>
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit">Submit</Button>
				</Form.Item>
			</Form>
		</>
	);
}
