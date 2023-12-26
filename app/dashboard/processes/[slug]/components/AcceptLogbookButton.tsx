'use client';

import { acceptLogbook } from '@/actions/LogbookActions';
import { Button, message } from 'antd';
import { useRouter } from 'next/navigation';

interface Props {
	student_no: number;
}

export default function AcceptLogBookButton({ student_no }: Props) {
	const router = useRouter();
	const [messageApi, contextHolder] = message.useMessage();

	async function acceptLogBookHandler(student_no: number) {
		try {
			let res = await acceptLogbook(student_no);
			if (res.ok) {
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
			<Button
				className="mt-3"
				type="default"
				onClick={() => acceptLogBookHandler(student_no)}
			>
				Accept the Logbook & Report
			</Button>
		</>
	);
}
