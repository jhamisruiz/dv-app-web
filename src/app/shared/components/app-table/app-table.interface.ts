export interface AppTable {
  field: string;
  label: string;
  type?: 'text' | 'number' | 'checkbox' | 'inputMask' | 'select' | 'exports' |
  'suggest' | 'dateTime' | 'date' | 'time' | 'habilitado' | 'button' | 'inputText' | 'boolean';
  customClass?: string;
  thStyle?: any;
  visible?: false;
  ///
  data?: any;
  fieldname?: string;
  optionLabel?: string;
  optionCode?: string;
  optionValue?: string;
  dataKey?: string;
  textTruncate?: false | true;
  dataoverlay?: false | true;
  numberwords?: number;

  id?: string;
  isObject?: boolean;
  isArray?: boolean;
  dateFormat?: string;
  class?: string;
  money?: string;
  linkDownload?: string;
  icon?: string;
  center?: true;
  minWidth?: string;
  url?: string;
  useUrl?: boolean;
  localUrl?: true,
  Labels?: Array<string>;
  separador?: string;
  toUpperCase?: boolean;
  //INPUT NUMBER
  min?: number;
  minFractionDigits?: number;
  max?: number;
  step?: number;
  prefix?: 'S/' | '$' | string;

  //buton
  button?: any;
  btnClass?: string;
  btnLabel?: string;
  btnBoolClass?: string;
  btnBoolIcon?: string;
  btnBool?: true | false;
  ifBtnField?: string;
  ifBtnName?: string;
  ifBtnClass?: string;

  function?: (event: any, data: any) => void;

  ///exports
  excel?: boolean;
  filter?: boolean;
}

export interface ParentVal {
  field: string;
  parentField: string;
}
