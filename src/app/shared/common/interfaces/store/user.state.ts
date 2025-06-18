import { CompanyModule } from '@app/shared/common/interfaces';

export interface UserStoreState {
  userId: number;
  userName: string;
  userAlias?: string;
  email?: string;
  profileId: number;
  settings?: any; // Personalización de usuario.
  privileges: any[];

  // Configuración de la empresa actual.
  currentCompanyId?: string;
  currentCorporationId?: string;
  currentModuleId: number;
  currentModule?: CompanyModule;
}

export const initialUserState: UserStoreState = {
  userId: 0,
  userName: 'Guest',
  email: 'guest@demo.com',
  profileId: 0,
  privileges: [],

  currentCompanyId: '001',
  currentCorporationId: '001',
  currentModule: undefined,
  currentModuleId: 18, // Default module ID
};
