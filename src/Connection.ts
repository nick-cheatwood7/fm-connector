import axios, { AxiosInstance, AxiosResponse } from "axios";
import { CreateRecordResponse, FindOptions, Record } from "./types";

export interface ConnectionOptions {
  account?: string;
  password?: string;
  dbName: string;
  hostUrl: string;
  apiVersion?: API_VERSION;
}

export enum API_VERSION {
  V1 = "v1",
  V2 = "v2",
  Latest = "vLatest",
}

export default class Connection {
  private token: string;
  private account: string;
  private password: string;
  public dbName: string;
  private hostUrl: string;
  private apiVersion: string;

  private baseUrl: string;

  private readonly instance: AxiosInstance;

  constructor(props: ConnectionOptions) {
    this.token = "";
    this.dbName = props.dbName;
    this.hostUrl = props.hostUrl;
    this.account = props.account as string;
    this.password = props.password as string;
    this.apiVersion = props.apiVersion || API_VERSION.V1;

    // init base url
    this.baseUrl = `${this.hostUrl}/fmi/data/${this.apiVersion}/databases/${this.dbName}`;

    // init axios defaults
    this.instance = axios.create({
      baseURL: this.baseUrl,
      data: {},
      responseType: "json",
      headers: {
        "content-type": "application/json",
      },
    });
  }

  // private incrementExpiration(): void {
  //   this.exp = Date.now() + 1000 * 60 * 15; // Expires in 15 mins
  // }

  async login(): Promise<void> {
    try {
      const res: AxiosResponse = await this.instance.post(
        "/sessions",
        {},
        {
          auth: { username: this.account, password: this.password },
        }
      );
      this.token = res.data.response.token;
      this.instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.token}`;
      console.log(`Logged into database "${this.dbName}"`);
    } catch (err) {
      console.error(`Unable to login to database "${this.dbName}"`);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.instance.delete(`/sessions/${this.token}`);
      console.log("Logged out");
    } catch (err) {
      console.error("Unable to logout");
    }
  }

  async create(
    layout: string,
    record: { fieldData: Object }
  ): Promise<CreateRecordResponse | null> {
    try {
      const res: AxiosResponse = await this.instance.post(
        `/layouts/${layout}/records`,
        { ...record }
      );
      return res.data.response;
    } catch (err) {
      return null;
    }
  }

  async duplicate(
    layout: string,
    recordId: string
  ): Promise<CreateRecordResponse | null> {
    try {
      const res: AxiosResponse = await this.instance.post(
        `/layouts/${layout}/records/${recordId}`
      );
      return res.data.response;
    } catch (err) {
      return null;
    }
  }

  async find(layout: string, criteria: FindOptions): Promise<Array<any>> {
    try {
      const res: AxiosResponse = await this.instance.post(
        `layouts/${layout}/_find`,
        { ...criteria }
      );
      return res.data.response.data;
    } catch {
      return [];
    }
  }

  async findById(layout: string, recordId: string): Promise<Record | null> {
    try {
      const record: AxiosResponse = await this.instance.get(
        `/layouts/${layout}/records/${recordId}`
      );
      return record.data.response.data[0];
    } catch {
      return null;
    }
  }

  async delete(layout: string, recordId: string): Promise<void> {
    try {
      await this.instance.delete(`layouts/${layout}/records/${recordId}`);
    } catch (err) {
      throw new Error(err);
    }
  }
}
