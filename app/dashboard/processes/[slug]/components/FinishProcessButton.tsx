'use client';

import { finishProcess } from '@/actions/ProcessActions';
import { Button, message } from 'antd';
import { useRouter } from 'next/navigation';

interface Props {
	student_no: number;
}

export default function FinishProcessButton({ student_no }: Props) {
	const router = useRouter();
	const [messageApi, contextHolder] = message.useMessage();

	async function finishProcessHandler(student_no: number) {
		try {
			let res = await finishProcess(student_no);
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
				onClick={() => finishProcessHandler(student_no)}
			>
				Finish the Process
			</Button>
		</>
	);
}
