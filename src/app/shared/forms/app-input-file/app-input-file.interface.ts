export interface DataFile {
  id?: any;
  delete?: boolean;
  data?: string | Array<any> | null;
  nombre?: string | null;
  tipo?: string | null;
  create?: boolean;
  url?: string | null;
}
