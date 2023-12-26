import { ActionResponse, ProcessDetails } from '@/types';
import { Database } from '@/types_db';
import { Tag } from 'antd';
import { ColumnFilterItem } from 'antd/es/table/interface';

export function dateToPostgre(millis: number) {
	return new Date(millis).toISOString();
}

export function postgreToDate(timestamp: string) {
	return new Date(timestamp);
}

export function isDatePassed(future: Date) {
	return future.getTime() - Date.now() < 0;
}

export function getDepartmentText(department?: string | null) {
	switch (department) {
		case 'AE':
			return 'Automative Engineering';
		case 'CE':
			return 'Civil Engineering';
		case 'CO':
			return 'Computer Engineering';
		case 'COTR':
			return 'Computer Engineering (Turkish)';
		case 'EE':
			return 'Electrical & Electronics Engineering';
		case 'EETR':
			return 'Electrical & Electronics Engineering (Turkish)';
		case 'ES':
			return 'Energy Systems Engineering';
		case 'IE':
			return 'Industrial Engineering';
		case 'ME':
			return 'Mechanical Engineering';
		default:
			return 'None';
	}
}

export function getDepartments() {
	const arr: Database['public']['Enums']['Department'][] = [];
	arr.push('AE');
	arr.push('CE');
	arr.push('CO');
	arr.push('COTR');
	arr.push('EE');
	arr.push('EETR');
	arr.push('ES');
	arr.push('IE');
	arr.push('ME');
	return arr;
}

export function departmentFilters() {
	let arr: ColumnFilterItem[] = [];

	let deps = getDepartments();
	for (let i = 0; i < deps.length; i++) {
		arr.push({
			text: getDepartmentText(deps[i]),
			value: deps[i],
		});
	}

	return arr;
}

export function customizedRequiredMark(
	label: React.ReactNode,
	{ required }: { required: boolean }
) {
	return (
		<>
			{required ? (
				<Tag color="error">Required</Tag>
			) : (
				<Tag color="warning">Optional</Tag>
			)}
			{label}
		</>
	);
}

export function getProcessInfoText(stage: ProcessDetails['stage']) {
	switch (stage) {
		case 'CIF':
			return 'Waiting for company information forms';
		case 'LOGBOOK':
			return 'Waiting for to get the signed logbook';
		case 'SUBMIT_REPORT':
			return 'Waiting for the report submitting';
		case 'ORAL_EXAM':
			return 'Waiting for the oral exam';
		case 'FINISHED':
			return 'Internship finished.';
	}
}

export function getProcessPercent(stage: ProcessDetails['stage']) {
	switch (stage) {
		case 'CIF':
			return 10;
		case 'LOGBOOK':
			return 20;
		case 'SUBMIT_REPORT':
			return 30;
		case 'ORAL_EXAM':
			return 80;
		case 'FINISHED':
			return 100;
	}
}

export function responseOk(): ActionResponse {
	return {
		ok: true,
	};
}

export function responseError(message?: string): ActionResponse {
	return {
		error: message ?? 'An error occurred',
	};
}
