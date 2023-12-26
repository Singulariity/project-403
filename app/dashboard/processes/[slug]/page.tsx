import { getProcess } from '@/actions/ProcessActions';
import supabaseClient from '@/lib/supabase-client';
import { getProcessPercent } from '@/lib/utils/Utils';
import { Alert, Card, Progress, Space } from 'antd';
import CreateStudentForm from '../../students/components/CreateStudentForm';
import GiveLogBookButton from './components/GiveLogbookButton';
import AcceptLogBookButton from './components/AcceptLogbookButton';
import FinishProcessButton from './components/FinishProcessButton';

export default async function ProcessPage({
	params,
}: {
	params: { slug: string };
}) {
	const process = await getProcess(params.slug);

	if (!process) {
		return (
			<>
				<Alert
					className="mb-4"
					message="Student not found. You can start an internship for the student from the form below."
					type="error"
				/>
				<CreateStudentForm />
			</>
		);
	}

	const { data: data_cif } = await supabaseClient
		.from('cifs')
		.select()
		.eq('student_no', process.student.no)
		.eq('is_accepted', true)
		.maybeSingle();

	const { data: data_logbook } = await supabaseClient
		.from('logbooks')
		.select()
		.eq('student_no', process.student.no)
		.maybeSingle();

	const { data: data_oralexam } = await supabaseClient
		.from('oral_exams')
		.select()
		.eq('student_no', process.student.no)
		.eq('is_accepted', true)
		.maybeSingle();

	function waitingMessage() {
		return (
			<Alert
				message="To proceed this step, student must complete the previous steps."
				type="warning"
				showIcon
			/>
		);
	}

	return (
		<>
			<h1>
				<b>
					Student: {process.student.name} {process.student.surname} -{' '}
					{process.student.no}
				</b>
			</h1>
			<Progress
				className="mt-5"
				type="circle"
				percent={getProcessPercent(process.stage)}
			/>
			<Space
				className="mt-5  w-2/3 mx-auto"
				direction="vertical"
				size="middle"
				style={{ display: 'flex' }}
			>
				<Card title="1. Summer Training Letter" size="small">
					<Alert
						message="Student got the letter and started the internship process."
						type="success"
						showIcon
					/>
				</Card>
				<Card title="2. Company Information Forms" size="small">
					{process.stage == 'CIF' ? (
						//TODO select part
						<Alert
							message="A company information form (CIF) must be selected to continue the process. You can accept a CIF from 'Company Information Forms' tab."
							type="info"
							showIcon
						/>
					) : data_cif ? (
						<Alert
							message="A company information form is accepted."
							type="success"
							showIcon
						/>
					) : (
						waitingMessage()
					)}
				</Card>
				<Card title="3. Signed Logbook" size="small">
					{process.stage == 'LOGBOOK' ? (
						<>
							<Alert
								message="After signing the logbook for the student, simply click the button below for process to the next step."
								type="info"
								showIcon
							/>
							<GiveLogBookButton
								student_no={process.student.no}
							/>
						</>
					) : data_logbook ? (
						<Alert
							message="Student got the signed logbook."
							type="success"
							showIcon
						/>
					) : (
						waitingMessage()
					)}
				</Card>
				<Card
					title="4. Logbook & Internship Report Submission"
					size="small"
				>
					{process.stage == 'SUBMIT_REPORT' ? (
						<>
							<Alert
								message="After accepting the logbook and the report of student, simply click the button below for process to the next step."
								type="info"
								showIcon
							/>
							<AcceptLogBookButton
								student_no={process.student.no}
							/>
						</>
					) : data_logbook?.is_accepted ? (
						<Alert
							message="Report submission accepted."
							type="success"
							showIcon
						/>
					) : (
						waitingMessage()
					)}
				</Card>
				<Card title="5. Oral Exam" size="small">
					{process.stage == 'ORAL_EXAM' ? (
						<>
							<Alert
								message="After the oral exam, simply click the button below for the finish internship process of the student."
								type="info"
								showIcon
							/>
							<FinishProcessButton
								student_no={process.student.no}
							/>
						</>
					) : data_oralexam ? (
						<Alert
							message="Student finished their internship."
							type="success"
							showIcon
						/>
					) : (
						waitingMessage()
					)}
				</Card>
			</Space>
		</>
	);
}
