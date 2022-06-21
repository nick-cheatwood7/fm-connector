export type LoginResponse = Response & {
  Body: {
    messages: Array<Message>;
    response: {
      token: string;
    };
    HTTPMessage: string;
    HTTPCode: number;
  };
};

export interface Message {
  message: string;
  code: string;
}

export type Record = {
  fieldData: Object;
  portalData: Object;
  recordId: string;
  modId: string;
};

export type CreateRecordResponse = {
  recordId: string;
  modId: string;
};

export type FindOptions = {
  query: Array<any>;
  sort?: Array<SortOptions>;
  portal?: Array<any>;
  limit?: number;
  offset?: number;
} & unknown;

export type SortOptions = {
  fieldName: string;
  sortOrder: "ascend" | "descend";
};
