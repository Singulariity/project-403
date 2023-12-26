'use client';

import { createAdvisor } from '@/actions/AdvisorActions';
import { Button, Form, Input, Select, Tag, message } from 'antd';
import {
	customizedRequiredMark,
	getDepartmentText,
	getDepartments,
} from '@/lib/utils/Utils';
import { useRouter } from 'next/navigation';

export default function CreateAdvisorForm() {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const router = useRouter();

	async function finishHandler(values: any) {
		try {
			let res = await createAdvisor(
				values.username,
				values.password,
				values.name,
				values.surname,
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
				<Form.Item name="username" label="Username" required>
					<Input placeholder="george1985" />
				</Form.Item>
				<Form.Item name="password" label="Password" required>
					<Input.Password placeholder="••••••••••" />
				</Form.Item>
				<Form.Item name="name" label="Name" required>
					<Input placeholder="George" />
				</Form.Item>
				<Form.Item name="surname" label="Surname" required>
					<Input placeholder="Cloud" />
				</Form.Item>
				<Form.Item name="department" label="Department">
					<Select defaultValue="none">
						<Select.Option value="none">None</Select.Option>
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
