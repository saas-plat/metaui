import { AxiosResponse } from 'axios';

export interface IRouteOption {
  path: string;
  query?: any;
  data?: any;
  hash?: string;
  callbacks?: any;
}

export interface Provider {
  api: {
    get<R = any>(url, params): Promise<AxiosResponse<R>>;

    post<R = any>(url, params, body): Promise<AxiosResponse<R>>;

    put(url, params?: any, body?: any): Promise<any>;

    delete(url, params?: any): Promise<any>;
  };

  history: {
    push: (option: IRouteOption, isValidated: boolean) => void;

    pop: (step: number, forceLeave: boolean) => void;

    popAndReturn: (data: any, step: number, forceLeave: boolean) => void;

    popTo: (option: IRouteOption, forceLeave: boolean) => void;

    popToRoot: (data, forceLeave: boolean) => void;

    popToReplace: (
      popOption: IRouteOption,
      replaceOption: IRouteOption,
      forceLeave: boolean
    ) => void;

    replace: (option: IRouteOption, forceLeave: boolean) => void;
  };

 
}

let impl: Provider;

// 需要注册技术平台基础能力，api、history、indexdb对象给框架
export function registerProvider(provider) {
  impl = provider;
}

export const api = {
  get: async <R = any>(url, params = null): Promise<AxiosResponse<R>> => {
    return impl.api.get(url, params);
  },

  post: async <R = any>(url, params, body): Promise<AxiosResponse<R>> => {
    return impl.api.post(url, params, body);
  },

  put: async (url, params?: any, body?: any): Promise<any> => {
    return impl.api.put(url, params, body);
  },

  delete: async (url, params?: any): Promise<any> => {
    return impl.api.delete(url, params);
  },
};

export const history = {
  push: (option: IRouteOption, isValidated: boolean = false) => {
    return impl.history.push(option, isValidated);
  },

  pop: (step: number = -1, forceLeave: boolean = false) => {
    return impl.history.pop(step, forceLeave);
  },

  popAndReturn: (data: any, step: number = -1, forceLeave: boolean = false) => {
    return impl.history.popAndReturn(step, step, forceLeave);
  },

  popTo: (option: IRouteOption, forceLeave: boolean = false) => {
    return impl.history.popTo(option, forceLeave);
  },

  popToRoot: (data = null, forceLeave: boolean = false) => {
    return impl.history.popToRoot(data, forceLeave);
  },

  popToReplace: (
    popOption: IRouteOption,
    replaceOption: IRouteOption,
    forceLeave: boolean = false
  ) => {
    return impl.history.popToReplace(popOption, replaceOption, forceLeave);
  },

  replace: (option: IRouteOption, forceLeave: boolean = false) => {
    return impl.history.replace(option, forceLeave);
  },
};

 