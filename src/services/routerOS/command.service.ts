import axios, { AxiosResponse } from "axios";

export class CommandService {
  baseUrl: string;
  directUrl: string;

  constructor(private host: string, public domain: string) {
    this.baseUrl = `${this.host}${this.domain}/`;
    this.directUrl = `${this.host}${this.domain}/direct/`;
  }

  public async get(parameter: string, direct = false) {
    try {
      const requestPath = `${
        direct ? this.directUrl : this.baseUrl
      }${parameter}`;
      const response = await axios.get(requestPath);
      return response;
    } catch (error) {
      if (error.response) {
        throw error.response;
      } else {
        throw {
          status: 404,
          statusText: "Connection Refused."
        } as AxiosResponse;
      }
    }
  }
}
