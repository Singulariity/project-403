'use client';

import { Button, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Database } from '@/types_db';
import {
	departmentFilters,
	getDepartmentText,
	getDepartments,
} from '@/lib/utils/Utils';
import { useRouter } from 'next/navigation';
import { deleteStudent } from '@/actions/StudentActions';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useSession } from '@/hooks/useSession';
import { ColumnFilterItem } from 'antd/es/table/interface';

interface TableProps {
	data: Database['public']['Tables']['students']['Row'][];
}

export default function StudentsTable({ data }: TableProps) {
	const [messageApi, contextHolder] = message.useMessage();
	const router = useRouter();
	const session_data = useSession();

	async function deleteStudentHandler(no: number) {
		try {
			let res = await deleteStudent(no);
			if (res.ok) {
				router.refresh();
			} else {
				messageApi.error(res.error);
			}
		} catch (error: any) {
			messageApi.error(error.message);
		}
	}

	const columns: ColumnsType<
		Database['public']['Tables']['students']['Row']
	> = [
		{
			title: 'Student Number',
			dataIndex: 'no',
			key: 'no',
			sorter: (a, b) => a.no - b.no,
			defaultSortOrder: 'ascend',
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Surname',
			dataIndex: 'surname',
			key: 'surname',
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Department',
			key: 'department',
			dataIndex: 'department',
			filterMode: 'menu',
			filters: departmentFilters(),
			onFilter: (value, record) => {
				if (value == record.department) {
					return true;
				}
				return false;
			},
			sorter: (a, b) => a.name.localeCompare(b.name),
			render: (department: string) => {
				return getDepartmentText(department);
			},
		},
		{
			title: 'Finished',
			key: 'finished_at',
			dataIndex: 'finished_at',
			filterMode: 'menu',
			filters: [
				{
					text: 'Finished',
					value: 'finished',
				},
				{
					text: 'Not finished',
					value: 'not_finished',
				},
			],
			onFilter: (value, record) => {
				if (value == 'finished') {
					return record.finished_at ? true : false;
				}
				if (value == 'not_finished') {
					return !record.finished_at ? true : false;
				}
				return true;
			},
			sorter: (a, b) => (a.finished_at ? 1 : 0) - (b.finished_at ? 1 : 0),
			render: (finished_at?: string) => {
				return finished_at ? (
					<Tag color="success">Yes</Tag>
				) : (
					<Tag color="red">No</Tag>
				);
			},
		},
		{
			title: 'Action',
			key: 'action',
			dataIndex: 'action',
			render: (_, record) => (
				<Space size="middle">
					<Button
						onClick={() => deleteStudentHandler(record.no)}
						type="primary"
						danger
						disabled={
							!session_data.session ||
							(!session_data.session.is_admin &&
								session_data.session.advisor.department !=
									record.department)
						}
					>
						Delete
					</Button>
					<Button
						onClick={() =>
							router.push(`/dashboard/processes/${record.no}`)
						}
						type="default"
						icon={<ArrowRightOutlined />}
					>
						Process
					</Button>
				</Space>
			),
		},
	];

	let data_ = data;
	for (let i = 0; i < data.length; i++) {
		(data_[i] as any).key = i;
	}

	return (
		<>
			{contextHolder}
			<Table
				columns={columns}
				dataSource={data}
				pagination={{ pageSize: 5 }}
			/>
		</>
	);
}
