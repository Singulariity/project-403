import { getProcess } from '@/actions/ProcessActions';
import { getProcessInfoText, getProcessPercent } from '@/lib/utils/Utils';
import { Card, Progress } from 'antd';

export default async function InfoPage({
	params,
}: {
	params: { slug: string };
}) {
	let process = await getProcess(params.slug);

	return (
		<div className="w-[500px] h-[300px] mx-auto mt-24">
			{process ? (
				<Card
					title={`Internship Process: ${process.student.name} ${process.student.surname}`}
				>
					<div style={{ width: 350 }}>
						<Progress
							percent={getProcessPercent(process.stage)}
							size="default"
							status={
								getProcessPercent(process.stage) == 100
									? 'success'
									: 'active'
							}
						/>
					</div>
					{getProcessInfoText(process.stage)}
				</Card>
			) : (
				<Card>
					There is no internship process for this student number
				</Card>
			)}
		</div>
	);
}
