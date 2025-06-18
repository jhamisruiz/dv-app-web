export interface UserConfiguration {
  settings: Record<string, any>;
  alias: string;
  email: string;
  profile_id: number;
  profile: string;
  user_id: number;
}

export interface UserPermission {
  user_create: boolean;
  user_read: boolean;
  user_update: boolean;
  user_delete: boolean;
}
