export default class CustomResponse {
  private _status: number
  private _message?: string
  private _data?: any
  private _page?: number
  private _pageCount?: number

  constructor(
    status: number,
    message?: string,
    data?: any,
    page?: number,
    pageCount?: number
  ) {
    this._status = status
    this._message = message
    this._data = data
    this._page = page
    this._pageCount = pageCount
  }

  public get status(): number {
    return this._status
  }

  public set status(status: number) {
    this._status = status
  }

  public get message(): string | undefined {
    return this._message
  }

  public set message(message: string) {
    this._message = message
  }

  public get data(): any {
    return this._data
  }

  public set data(data: any) {
    this._data = data
  }

  public get pageCount(): number | undefined {
    return this._pageCount
  }

  public set pageCount(value: number | undefined) {
    this._pageCount = value
  }

  public get page(): number | undefined {
    return this._page
  }

  public set page(value: number | undefined) {
    this._page = value
  }

  toJSON() {
    return {
      status: this._status,
      message: this._message,
      data: this._data,
      page: this._page,
      pageCount: this._pageCount
    }
  }
}
