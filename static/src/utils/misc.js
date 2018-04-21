
/**
 * Parse JSON response from network request.
 *
 * @param  {Object} response The network request response.
 * @return {Object}          The parsed response JSON
 */
export function parseJson(response) {
  return new Promise(resolve => response.json()
    .then(json => resolve({
      status: response.status,
      ok: response.ok,
      json
    })));
}

/**
 * Makes a fetch request to the given url.
 *
 * @param  {string} url     The URL for which to send a request.
 * @param  {Object} options Fetch options
 * @return {Promise}        The request promise.
 */
export function request(url, options) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(parseJson)
      .then((response) => {
        if (response.ok) {
          return resolve(response.json);
        }

        return reject(response);
      })
      .catch(error => reject(new Error(error.message)));
  });
}
