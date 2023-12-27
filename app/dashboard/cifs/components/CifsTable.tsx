'use client';

import { Button, Input, InputRef, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Database } from '@/types_db';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { deleteCif, updateCif } from '@/actions/CifActions';
import { ExportOutlined, SearchOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { ColumnType } from 'antd/lib/table';

interface TableProps {
	data: Database['public']['Tables']['cifs']['Row'][];
}

type DataIndex = keyof Database['public']['Tables']['cifs']['Row'];

export default function CifsTable({ data }: TableProps) {
	const [messageApi, contextHolder] = message.useMessage();
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	const handleSearch = (
		selectedKeys: string[],
		confirm: (param?: FilterConfirmProps) => void,
		dataIndex: DataIndex
	) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setSearchText('');
	};
	const router = useRouter();
	const supa = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	async function deleteCifHandler(id: number) {
		try {
			let res = await deleteCif(id);
			if (res.ok) {
				router.refresh();
			} else {
				messageApi.error(res.error);
			}
		} catch (error: any) {
			messageApi.error(error.message);
		}
	}

	async function updateCifHandler(id: number, accept_status: boolean) {
		try {
			let res = await updateCif(id, accept_status);
			if (res.ok) {
				router.refresh();
			} else {
				messageApi.error(res.error);
			}
		} catch (error: any) {
			messageApi.error(error.message);
		}
	}

	const getColumnSearchProps = (
		dataIndex: DataIndex
	): ColumnType<Database['public']['Tables']['cifs']['Row']> => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(
							selectedKeys as string[],
							confirm,
							dataIndex
						)
					}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							handleSearch(
								selectedKeys as string[],
								confirm,
								dataIndex
							)
						}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() =>
							clearFilters && handleReset(clearFilters)
						}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						Close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined
				style={{ color: filtered ? '#1677ff' : undefined }}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex]!.toString()
				.toLowerCase()
				.includes((value as string).toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
	});

	const columns: ColumnsType<Database['public']['Tables']['cifs']['Row']> = [
		{
			title: 'Student Number',
			dataIndex: 'student_no',
			key: 'student_no',
			sorter: (a, b) => a.student_no - b.student_no,
			defaultSortOrder: 'ascend',
			...getColumnSearchProps('student_no'),
		},
		{
			title: 'Company Name',
			dataIndex: 'company_name',
			key: 'company_name',
			sorter: (a, b) => a.company_name.localeCompare(b.company_name),
		},
		{
			title: 'Country',
			dataIndex: 'country',
			key: 'country',
			sorter: (a, b) => a.country.localeCompare(b.country),
		},
		{
			title: 'Status',
			dataIndex: 'is_accepted',
			key: 'is_accepted',
			filterMode: 'menu',
			filters: [
				{
					text: 'Accepted',
					value: 'accepted',
				},
				{
					text: 'Waiting',
					value: 'waiting',
				},
			],
			onFilter: (value, record) => {
				if (value == 'accepted') {
					return record.is_accepted ?? false;
				}
				if (value == 'waiting') {
					return !record.is_accepted;
				}
				return true;
			},
			sorter: (a, b) => (a.is_accepted ? 1 : 0) - (b.is_accepted ? 1 : 0),
			render: (is_accepted?: boolean) => {
				return is_accepted ? (
					<Tag color="success">Accepted</Tag>
				) : (
					<Tag color="warning">Waiting</Tag>
				);
			},
		},
		{
			title: 'CIF File',
			key: 'pdf_path',
			dataIndex: 'pdf_path',
			render: (pdf_path: string) => {
				let data = supa.storage.from('cifs').getPublicUrl(pdf_path);
				return (
					<Button
						href={data.data.publicUrl}
						target="_blank"
						color="info"
						icon={<ExportOutlined />}
					>
						Open
					</Button>
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
						onClick={() => deleteCifHandler(record.id)}
						type="primary"
						danger
					>
						Delete
					</Button>
					{record.is_accepted ? (
						<Button
							onClick={() => updateCifHandler(record.id, false)}
							color="warning"
						>
							Un-accept
						</Button>
					) : (
						<Button
							onClick={() => updateCifHandler(record.id, true)}
							color="success"
						>
							Accept
						</Button>
					)}
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
