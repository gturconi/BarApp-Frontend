export type Avatar = {
  data: number[];
  type: string;
};

export interface PhotoResult {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: string;
  size: number;
}
