'use client';

import { createCif } from '@/actions/CifActions';
import { customizedRequiredMark } from '@/lib/utils/Utils';
import { UploadOutlined } from '@ant-design/icons';
import { createClient } from '@supabase/supabase-js';
import { Button, DatePicker, Form, Input, Upload, message } from 'antd';
import { useRouter } from 'next/navigation';

export default function CreateCifForm() {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const router = useRouter();

	async function finishHandler(values: any) {
		try {
			let res = await createCif(
				values.no,
				values.company_name,
				values.country,
				values.intern_start_date.toDate(),
				values.intern_end_date.toDate(),
				values.file[0].uid
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

	const getFile = (e: any) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	};

	async function upload(options: any) {
		const supa = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);

		const { error } = await supa.storage
			.from('cifs')
			.upload(options.file.uid, options.file);

		if (error) {
			return setTimeout(() => {
				options.onError('ok');
			}, 0);
		}

		return setTimeout(() => {
			options.onSuccess('ok');
		}, 0);
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
				<Form.Item name="company_name" label="Company Name" required>
					<Input placeholder="Google" />
				</Form.Item>
				<Form.Item name="country" label="Country" required>
					<Input placeholder="Türkiye" />
				</Form.Item>
				<Form.Item
					name="intern_start_date"
					label="Internship Start Date"
					required
				>
					<DatePicker format="YYYY-MM-DD HH:mm" className="w-full" />
				</Form.Item>
				<Form.Item
					name="intern_end_date"
					label="Internship End Date"
					required
				>
					<DatePicker format="YYYY-MM-DD HH:mm" className="w-full" />
				</Form.Item>
				<Form.Item
					name="file"
					label="PDF File"
					valuePropName="fileList"
					getValueFromEvent={getFile}
					required
				>
					<Upload
						name="file"
						customRequest={upload}
						listType="picture"
						maxCount={1}
						accept="application/pdf"
					>
						<Button icon={<UploadOutlined />}>
							Click to upload
						</Button>
					</Upload>
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit">Submit</Button>
				</Form.Item>
			</Form>
		</>
	);
}
