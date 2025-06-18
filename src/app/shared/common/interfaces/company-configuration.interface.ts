import { ModuleParameter } from './module-parameter.interface';

export interface CompanyConfiguration {
  /** Nombre de la empresa */
  business_name: string;

  /** Dirección de la empresa */
  company_address: string;

  /** Identificador inico de la empresa */
  company_uid: string;

  /** Id de la empresa */
  company_id: number;

  /** Tipo de perfil(rubro) */
  profile_type_id: number;

  /** Parametros globales de la empresa */
  parameters: ModuleParameter[];

  /** Personalización */
  settings: Record<string, any>;
}
