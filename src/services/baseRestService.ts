import Axios, { AxiosInstance, AxiosPromise, AxiosResponse, AxiosBasicCredentials, AxiosRequestConfig } from "axios";
import Qs from "qs";
import { MessageService } from "vue-mf-module";


export enum CacheStategy {
  NetworkFirst,
  CacheFirst,
  None
}


/// ----------------------------------------------------------------------------  ///
///                                 ATTENZIONE                                    ///
///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
/// ----------------------------------------------------------------------------  ///
export class baseRestService {

  protected allwaysSendAuthenticationToken = true;
  protected saveToSessionStorage = true;
  baseUrl: () => string = () => "";

  OnError?: OnErrorDelegate;
  OnHeadersPreparing?: OnHeadersPreparingDelegate;

  protected http: AxiosInstance;

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  constructor() {
    this.http = Axios.create();
    this.setArraySerializationMethod();
  }


  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  private setArraySerializationMethod() {
    this.http.interceptors.request.use(async (reqConfig) => {
      //change the default serializer only if the method is a GET
      if (reqConfig.method !== "get") {
        return reqConfig;
      }
      //the 'repeat' is the standard behavior for array: arrKey=x&arrKey=y&arrKey=z....
      reqConfig.paramsSerializer = (params) => {
        return Qs.stringify(params, { arrayFormat: "repeat" });
      };
      return reqConfig;
    });
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async getRaw(uri: string, params: object = {}, sendAuthenticationToken = false, cacheStrategy: CacheStategy = CacheStategy.None): Promise<AxiosResponse> {

    const response = await this.http.get(this.baseUrl() + uri,
      {
        headers: await this.prepareHeaders(this.allwaysSendAuthenticationToken || sendAuthenticationToken, false, cacheStrategy),
        params: params,
        responseType: 'arraybuffer'
      });

    if (response.status != 200 && this.OnError) this.OnError(response);
    return response;
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async get(uri: string, params: object = {}, sendAuthenticationToken = false, cacheStrategy: CacheStategy = CacheStategy.NetworkFirst): Promise<AxiosResponse> {
    const response = await this.http.get(this.baseUrl() + uri,
      {
        headers: await this.prepareHeaders(this.allwaysSendAuthenticationToken || sendAuthenticationToken, false, cacheStrategy),
        params: params,
        transformResponse: (resp => resp ? JSON.parse(resp, toDate) : null)
      });

    if (response.status != 200 && this.OnError) this.OnError(response);
    return response;
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async Get<TResult>(uri: string, params: object = {}, sendAuthenticationToken = false, cacheStrategy: CacheStategy = CacheStategy.NetworkFirst): Promise<TResult | null> {
    const result = await this.get(uri, params, sendAuthenticationToken, cacheStrategy);
    if (result.status == 200)
      return result.data as TResult;
    else if (this.OnError) this.OnError(result);
    return null;
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async post(uri: string, data: any, params: object = {}, sendAuthenticationToken = false, cacheStrategy: CacheStategy = CacheStategy.None): Promise<AxiosResponse> {
    const response = await this.http.post(this.baseUrl() + uri, data,
      {
        headers: await this.prepareHeaders(this.allwaysSendAuthenticationToken || sendAuthenticationToken, true, cacheStrategy),
        params: params,
        transformResponse: (resp => resp ? JSON.parse(resp, toDate) : null)
      } as AxiosRequestConfig);
    // if (response.status != 200 && this.OnError) this.OnError(response);
    return response;
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async Post<TResult>(uri: string, data: any, params: object = {}, sendAuthenticationToken = false, cacheStrategy: CacheStategy = CacheStategy.None): Promise<TResult | null> {
    const result = await this.post(uri, data, params, sendAuthenticationToken, cacheStrategy);
    if (result.status == 200)
      return result.data as TResult;
    else if (this.OnError) this.OnError(result);
    return null;
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async put(uri: string, data: any, params: object = {}, sendAuthenticationToken = false, cacheStrategy: CacheStategy = CacheStategy.None): Promise<AxiosResponse> {
    const response = await this.http.put(this.baseUrl() + uri, data,
      {
        headers: await this.prepareHeaders(this.allwaysSendAuthenticationToken || sendAuthenticationToken, true, cacheStrategy),
        params: params,
        transformResponse: (resp => resp ? JSON.parse(resp, toDate) : null)
      });
    if (response.status != 200 && this.OnError) this.OnError(response);
    return response;
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async Put<TResult>(uri: string, data: any, params: object = {}, sendAuthenticationToken = false, cacheStrategy: CacheStategy = CacheStategy.None): Promise<TResult | null> {
    const result = await this.put(uri, data, params, sendAuthenticationToken, cacheStrategy);
    if (result.status == 200)
      return result.data as TResult;
    else if (this.OnError) this.OnError(result);
    return null;
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async delete(uri: string, params: object = {}, sendAuthenticationToken = false, cacheStrategy: CacheStategy = CacheStategy.None): Promise<AxiosResponse> {
    const response = await this.http.delete(this.baseUrl() + uri,
      {
        headers: await this.prepareHeaders(this.allwaysSendAuthenticationToken || sendAuthenticationToken, false, cacheStrategy),
        params: params,
        transformResponse: (resp => resp ? JSON.parse(resp, toDate) : null)
      });
    if (response.status != 200 && this.OnError) this.OnError(response);
    return response;
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async Delete<TResult>(uri: string, params: object = {}, sendAuthenticationToken = false, cacheStrategy: CacheStategy = CacheStategy.None): Promise<TResult | null> {
    const result = await this.delete(uri, params, sendAuthenticationToken, cacheStrategy);
    if (result.status == 200)
      return result.data as TResult;
    else if (this.OnError) this.OnError(result);
    return null;
  }

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async prepareHeaders(auth = false, json = true, cacheStrategy: CacheStategy = CacheStategy.None): Promise<any> {

    const headers: any = {};
    if (auth) {
      const authData = await this.getAuthenticationToken();
      if (authData) {
        headers['Authorization'] = 'Bearer ' + authData.access_token;
      }
    }
    if (json) headers['Content-Type'] = 'application/json';

    switch (cacheStrategy) {
      case CacheStategy.NetworkFirst: headers['X-Strategy'] = 'networkFirst'; break;
      case CacheStategy.CacheFirst: headers['X-Strategy'] = 'cacheFirst'; break;
      case CacheStategy.None:
      default: break;
    }

    if (this.OnHeadersPreparing) this.OnHeadersPreparing(headers);
    return headers;
  }

  protected static _token: AuthToken | null;

  /// ----------------------------------------------------------------------------  ///
  ///                                 ATTENZIONE                                    ///
  ///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
  /// ----------------------------------------------------------------------------  ///
  protected async getAuthenticationToken(): Promise<AuthToken> {
    return await MessageService.Instance.ask("ACCESS_TOKEN")
  }
}

export interface OnErrorDelegate { (data: DataResponse): void; }
interface OnHeadersPreparingDelegate { (headers: Headers): void; }

/// ----------------------------------------------------------------------------  ///
///                                  ATTENZIONE                                    ///
///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
/// ----------------------------------------------------------------------------  ///
export interface AuthToken {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  expiration_date: number;
  resource: string;
  userName: string;
  token_type: string;
}

/// ----------------------------------------------------------------------------  ///
///                                 ATTENZIONE                                    ///
///            VIETATO APPORTARE QUALSIASI MODIFICA A QUESTO METODO O CLASSE      ///
/// ----------------------------------------------------------------------------  ///
export interface DataResponse {
  status: number;
  statusText: string;
  data: any;
}


// const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z?|(\+|-)([\d|:]*))?$/;
const reISO = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;
// eslint-disable-next-line no-useless-escape
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

export function toDate(key: string, value: string) {
  if (typeof value === "string") {
    let a = reISO.exec(value);
    if (a) {
      if (value.indexOf("Z") <= 0)
        return new Date(value + "Z");
      else
        return new Date(value);
    }
    a = reMsAjax.exec(value);
    if (a) {
      const b = a[1].split(/[-+,.]/);
      return new Date(b[0] ? +b[0] : 0 - +b[1]);
    }
  }
  return value;
}
