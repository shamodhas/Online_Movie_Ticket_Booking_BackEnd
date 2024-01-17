class CustomResponse {
  private _status: number;
  private _message: string;
  private _data?: any;

  constructor(status: number, message: string, data: any) {
    this._status = status;
    this._message = message;
    this._data = data;
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
  toJSON() {
    return {
      status: this._status,
      message: this._message,
      data: this._data,
    };
  }
}
