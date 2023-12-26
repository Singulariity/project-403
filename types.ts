import { Database } from './types_db';

export type UserDetails = {
	username: string;
	name: string;
	surname: string;
	department: Database['public']['Enums']['Department'] | null;
};

export type SessionDetails = {
	advisor: UserDetails;
	is_admin: boolean;
	expires_at: Date;
	token: string;
};

export type ProcessDetails = {
	student: Database['public']['Tables']['students']['Row'];
	stage: 'CIF' | 'LOGBOOK' | 'SUBMIT_REPORT' | 'ORAL_EXAM' | 'FINISHED';
};

export type ActionResponse = {
	error?: string;
	ok?: boolean;
};
