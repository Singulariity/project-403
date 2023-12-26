'use client';

import { giveLogbook } from '@/actions/LogbookActions';
import { Button, message } from 'antd';
import { useRouter } from 'next/navigation';

interface Props {
	student_no: number;
}

export default function GiveLogBookButton({ student_no }: Props) {
	const router = useRouter();
	const [messageApi, contextHolder] = message.useMessage();

	async function giveLogBookHandler(student_no: number) {
		try {
			let res = await giveLogbook(student_no);
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
				onClick={() => giveLogBookHandler(student_no)}
			>
				Logbook Signed
			</Button>
		</>
	);
}
