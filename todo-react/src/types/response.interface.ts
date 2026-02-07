interface IDataProperties {
  createdAt?: string;
  updatedAt?: string;
}

export interface IResponse<T> {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data?: (T & IDataProperties) | (T & IDataProperties)[];
  meta?: {};
  error?: {};
}
