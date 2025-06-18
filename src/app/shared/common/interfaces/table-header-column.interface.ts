export interface TableHeaderColumn {
  description: string;
  data: string;
  type?: keyof 'string' | 'number' | 'mixed' | 'boolean';
  orderable?: boolean;
  searchable?: boolean;
  color?: string;
  order: number;
  width?: number;
  visible: boolean;
  totalizable?: boolean;
}
