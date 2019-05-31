import fetch from 'utils/FetchUtils';

const ENDPOINT_PREFIX = '/api/v1/profiles';

export async function getSelfProfile () {
  return fetch(`${ENDPOINT_PREFIX}/me`, {
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.status === 200) {
        return response.text();
      }
      return '{}';
    })
    .then(body => {
      let parsed = JSON.parse(body);
      return parsed;
    });
}
