'use client';

import { Button, Space, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { departmentFilters, getDepartmentText } from '@/lib/utils/Utils';
import { useRouter } from 'next/navigation';
import { deleteAdvisor } from '@/actions/AdvisorActions';
import { UserDetails } from '@/types';
import { useSession } from '@/hooks/useSession';

interface TableProps {
	data: UserDetails[];
}

export default function AdvisorsTable({ data }: TableProps) {
	const [messageApi, contextHolder] = message.useMessage();
	const router = useRouter();
	const session_data = useSession();

	async function deleteUserHandler(username: string) {
		try {
			let res = await deleteAdvisor(username);
			if (res.ok) {
				router.refresh();
			} else {
				messageApi.error(res.error);
			}
		} catch (error: any) {
			messageApi.error(error.message);
		}
	}

	const columns: ColumnsType<UserDetails> = [
		{
			title: 'Username',
			dataIndex: 'username',
			key: 'username',
			sorter: (a, b) => a.username.localeCompare(b.username),
			render: (_, record) => {
				return (
					<Typography.Text
						type={
							session_data.session?.advisor.username ==
							record.username
								? 'warning'
								: undefined
						}
					>
						{record.username}
					</Typography.Text>
				);
			},
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
			sorter: (a, b) => a.surname.localeCompare(b.surname),
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
			sorter: (a, b) =>
				getDepartmentText(a.department).localeCompare(
					getDepartmentText(b.department)
				),
			render: (department: string) => {
				return getDepartmentText(department);
			},
		},
		{
			title: 'Action',
			key: 'action',
			dataIndex: 'action',
			render: (_, record) => (
				<Space size="middle">
					<Button
						onClick={() => deleteUserHandler(record.username)}
						type="primary"
						danger
						disabled={
							!session_data.session ||
							!session_data.session.is_admin
						}
					>
						Delete
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
