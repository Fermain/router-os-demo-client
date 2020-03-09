import oboe from "oboe";
import { Observable } from "rxjs";

export class StreamService {
  baseUrl: string;
  directUrl: string;

  constructor(
    private host: string,
    public domain: string,
    private path: string
  ) {
    this.baseUrl = `${this.host}${this.domain}/`;
    this.directUrl = `${this.host}${this.domain}/direct/`;
  }

  private formStreamRequestPath(path: string, params: any): string {
    const queryString = new URLSearchParams({ ...params });
    if (params.n) {
      queryString.append("n", params.n);
    }
    return `${path}?${queryString.toString()}`;
  }

  private getStreamObservable(
    requestPath: string,
    params: any
  ): Observable<unknown> {
    const url = this.formStreamRequestPath(requestPath, params);
    const stream = oboe(url);
    return new Observable(sub => {
      stream.node("![*]", chunk => sub.next(chunk));
      stream.fail(error => sub.error(error));
      stream.done(sub.complete.bind(sub));
    });
  }

  public async start(params: any, direct = false) {
    const requestPath = `${direct ? this.directUrl : this.baseUrl}${this.path}`;
    try {
      return this.getStreamObservable(requestPath, params);
    } catch (error) {
      if (error.response) {
        throw error.response;
      } else {
        throw error;
      }
    }
  }
}
