export default class CustomResponse {
  private _status: number;
  private _message: string;
  private _data?: any;
  private _pageCount?: number;

  constructor(status: number, message: string, data?: any, pageCount?: number) {
    this._status = status;
    this._message = message;
    this._data = data;
    this._pageCount = pageCount;
  }

  public get status(): number {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }

  public get message(): string {
    return this._message;
  }

  public set message(message: string) {
    this._message = message;
  }

  public get data(): any {
    return this._data;
  }

  public set data(data: any) {
    this._data = data;
  }

  public get pageCount(): number | undefined {
    return this._pageCount;
  }

  public set pageCount(value: number | undefined) {
    this._pageCount = value;
  }

  toJSON() {
    return {
      status: this._status,
      message: this._message,
      data: this._data,
      pageCount: this._pageCount,
    };
  }
}
