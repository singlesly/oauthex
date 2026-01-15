import { AxiosError } from 'axios';

export function extractAxiosError(error: AxiosError): Record<string, any> {
  return {
    message: error.message,
    name: error.name,
    stack: error.stack
      ? error.stack.split('\n').slice(0, 3).join('\n')
      : undefined,
    config: error.config
      ? {
          url: error.config.url,
          method: error.config.method?.toUpperCase(),
          baseURL: error.config.baseURL,
          params: error.config.params,
          headers: sanitizeHeaders(error.config.headers),
        }
      : undefined,
    response: error.response
      ? {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: sanitizeHeaders(error.response.headers),
          data: truncateData(error.response.data),
        }
      : undefined,
    request: error.request ? '[HTTP Request Sent]' : '[No Request]',
  };
}

function sanitizeHeaders(headers: any): Record<string, any> | undefined {
  if (!headers) return undefined;
  const safe: Record<string, any> = {};
  for (const key in headers) {
    const lowerKey = key.toLowerCase();
    // Скрываем чувствительные заголовки
    if (
      lowerKey.includes('authorization') ||
      lowerKey.includes('cookie') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('token')
    ) {
      safe[key] = '[REDACTED]';
    } else {
      safe[key] = headers[key];
    }
  }
  return safe;
}

function truncateData(data: any, maxLength = 500): any {
  try {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    if (str.length <= maxLength) return data;
    return `${str.substring(0, maxLength)}... (truncated)`;
  } catch (e) {
    return '[Non-serializable data]';
  }
}
