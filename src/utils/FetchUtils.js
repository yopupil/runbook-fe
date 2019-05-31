import { PermissionDeniedError, NotFoundError } from 'utils/CustomErrors';
import { logOrRaise } from './LogUtils';

// Rewire window.fetch so that its usage is not allowed
const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export function safeJSONParse (target, defaultValue) {
  try {
    return JSON.parse(target);
  } catch (e) {
    logOrRaise(e);
    if (e instanceof SyntaxError) {
      return defaultValue;
    } else {
      // Raise all other exceptions
      throw new Error(e);
    }
  }
}

export function getCookie (name) {
  let nameEQ = name + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default function wrappedFetch (url, options) {
  if (CSRF_PROTECTED_METHODS.includes(options.method)) {
    options.headers = options.headers || {};
    options.headers['X-CSRFToken'] = getCookie('csrf_token');
  }
  return window
    .fetch(url, options)
    .then(response => {
      switch (response.status) {
        case 401:
          return (window.location.href =
            '/auth/login?next=' + encodeURIComponent(window.location.href));
        case 403:
          throw new PermissionDeniedError();
        case 404:
          throw new NotFoundError();
        case 500:
          return response.text().then(error => {
            try {
              error = JSON.parse(error);
              if (error.message) {
                error = error.message;
              }
            } catch (error) {
              // Ignore
            }
            throw new Error(error);
          });
        default:
          return response;
      }
    })
    .catch(err => {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Error while making fetch call to ${url} ${err}`);
      }
      throw err;
    });
}
