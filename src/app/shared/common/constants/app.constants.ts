export const APP_URL = 'https://devnec.nectextil.pe/'; // enviroment.apiBaseAddr

// NOTE: HEADERS
export const TRANSACTION_HEADER = 'app-transaction-id';
export const MODULE_ID_HEADER = 'app-module-id';
export const COMPONENT_ID_HEADER = 'app-component-id';
export const CORPORATION_ID_HEADER = 'app-corporation-id';
export const APP_KEY = '120DF37295A64838B2E8DF280E590AA6';

export const APP_PHAT_COMPONENT = 1;

// NOTE: DATA FIELDS
export const ID_FIELD = 'id';
export const CODE_FIELD = 'codigo';
export const SERIE_FIELD = 'serie';
export const NUMBER_FIELD = 'numero';
export const TRANSACTION_UID_FIELD = 'transaction_uid';
export const COMPANY_ID_FIELD = 'idempresa';
export const ENABLED_FIELD = 'habilitado';
export const DOCUMENT_VERSION = 'version';
export const LOCAL_LANGUAGE = 'lang';
export const LOCAL_CORPORATION = 'c';

// NOTE: API PATH

export const UBIGEO_PATH = '/ubigeo';
export const LOGIN_API_PATH = '/login';//'/auth';
export const LOGOUT_API_PATH = '/logout';//FIXME: implementar
export const DATAHANDLER_API_PATH = '/data-handler';

// NOTE: HTTP PARAMS
export const PARAM_ID = 'id';
export const PARAM_TYPE_ID = 'tid';
export const PARAM_PROC_ID = 'pid';
export const PARAM_COMPONENT_ID = 'cid';
export const SUGGEST_COMPONENT_ID = 'sid';
export const PARAM_MODULE_ID = 'mid';
export const PARAM_CONTROLLER_ID = 'id';
export const PARAM_ACTION_ID = 'aid';
export const PARAM_IS_ADVANCED = 'advanced';
export const PARAM_SEARCH_FIELD = 'search';
export const PARAM_CORRELATED_SEARCH = 'correlated';

//
export enum COMPONENT_TYPE { TABLE, FORM, LIST }
export enum COMPONENT_ACTION_TYPE { PRINT }

export const DEFAULT = {
  LANGUAGE: 'es',
  THEME: 'light',
  NAV_THEME: 'default',
  FONT_SIZE: 'medium',
  TEXT_DIR: 'ltr',
};


export const PRIVILEGES = {
  CREATE: 'nuevo',
  EDIT: 'editar',
  DELETE: 'borrar',
  OVERRIDE: 'anular',
  READ: 'consultar',
  PRINT: 'imprimir',
  SHOW_LOG: 'ver_logs',
};

export const NUMEROS_NOMBRES: string[] = [
  'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
  'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco',
  'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta_y_uno',
];
