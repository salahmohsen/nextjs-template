import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method
} from 'axios';

export type FetcherArgs = {
  options: FetcherOptions;
  path: string;
};

export interface FetcherResponse<T> {
  data: null | T;
  error: null | string;
}

interface FetcherOptions extends Omit<AxiosRequestConfig, 'data' | 'url'> {
  baseUrl?: string;
  bearerToken?: string;
  body?: unknown;
  method?: Method;
  signal?: AbortSignal;
}

export const fetcher = async <T>(
  path: string,
  options: FetcherOptions
): Promise<FetcherResponse<T>> => {
  const {
    baseUrl = process.env.NEXT_PUBLIC_API_URL,
    bearerToken,
    body,
    method = 'GET',
    ...axiosOptions
  } = options;

  if (!baseUrl) {
    console.error(
      'API_BASE_URL is not defined in environment variables and no baseUrl provided'
    );
    return { data: null, error: 'API base URL is not defined' };
  }

  // Ensure baseUrl doesn't end with a slash and path starts with a slash
  const normalizedBaseUrl = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Combine base URL and path
  const url = `${normalizedBaseUrl}${normalizedPath}`;

  const config: AxiosRequestConfig = {
    ...axiosOptions,
    data: body,
    headers: {
      ...axiosOptions.headers,
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` })
    },
    method,

    url
  };
  console.log('Fetcher config:', config);
  try {
    const response: AxiosResponse<T> = await axios(config);

    return { data: response.data, error: null };
  } catch (error) {
    const axiosError = error as AxiosError;
    let errorMessage = 'An error occurred while fetching data';

    if (axiosError.response) {
      errorMessage = `Server responded with status ${axiosError.response.status}: ${axiosError.response.statusText}`;
    } else if (axiosError.request) {
      errorMessage = 'No response received from the server';
    } else if (axiosError.name === 'AbortError') {
      errorMessage = 'Fetch aborted';
    } else if (axiosError.name === 'CanceledError') {
      errorMessage = 'Fetch canceled';
    } else {
      errorMessage = axiosError.message || errorMessage;
    }

    console.error('Fetcher error:', errorMessage);
    return { data: null, error: errorMessage };
  }
};
