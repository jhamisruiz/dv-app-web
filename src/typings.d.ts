interface JQuery {
  uniform(options?: any): any;
  DataTable(options: any): any;
  modal(options?: any): any;
  perfectScrollbar(options?: any): any;
  bootstrapResponsiveTabs(options?: any): any;
  select2(options?: any): any;
  bootstrapSwitch(...args: any[]): any;
  reportBro(...args: any[]): any;
  spectrum(...args: any[]): any;
  NsReportBro(...args: any[]): any;
  sessionTimeout(...args: any[]): any;
  tokenfield(...args: any[]): any;
  dropdown(...args: any[]): any;
  daterangepicker(...args: any[]): any;
  floatThead(...args: any[]): any;
}

interface JQueryStatic {
  sessionTimeout(...args: any[]): any;
}

interface IViewMap {
  title: string;
  icon?: string;
  component: Record<string, unknown>;
}
interface BtnOption {
  description: string;
  icon?: string;
  isSeparator?: boolean;
  shortcut?: string;
}

interface InputAddon {
  text?: string;
  icon?: string;
  class?: string;
  click?: () => void;
  isBtn?: boolean;
  prepend?: boolean;
  append?: boolean;
}

declare let pdfMake: any;

declare module 'tabulator-tables' {
  let Tabulator: any;
  export default Tabulator;
}

declare module 'src/resources/js/plugins/report_bro/autosize.min.js' {
  let value: any;

  export default value;
}

declare module 'src/resources/js/plugins/report_bro/JsBarcode.all.min.js' {
  let value: any;

  export default value;
}
declare module 'src/resources/js/plugins/notifications/sweet_alert.min.js' {
  let value: any;

  export default value;
}

declare module 'node_modules/pdfmake/build/vfs_fonts';
declare module 'src/resources/js/plugins/notifications/pnotify.min.js';
declare module 'chart.js';
