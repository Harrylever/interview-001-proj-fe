export type TOptionType = 'main' | 'sub' | 'child' | 'subchild';

export interface IOptions {
  _id: string;
  name: string;
  type: TOptionType;
  value: number;
  index: number;
}

export interface IOptionsResponse {
  data: Array<IOptions>
  message: string;
  success: boolean;
}

export interface IRecord {
  _id: string;
  name: string;
  sectors: Array<{ value: string; _id: string }>;
  checked: boolean;
}

export interface IRecordResponse {
  data: IRecord;
  message: string;
  success: boolean;
}
