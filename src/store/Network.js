import { Alert } from 'react-native';
import { action, observable, map, asMap, extendObservable } from 'mobx';
import { autobind, throttle } from 'core-decorators';
import { Actions } from 'react-native-mobx';
import { DEBUG } from '../utils/env';

/**
 * This store handles authentication and network
 * requests to the postbox api.
 */
export default class Network {

  /**
   * Constructor
   * @param {object} Domain store
   */
  constructor({ network = {} }) {
    extendObservable(this, {
      ...network,
      history: asMap(network.history),
    });
  }

  /**
   * @static {string} URL to the API endpoint
   */
  apiUrl = 'https://api.mappan.is/epo/v1';

  /**
   * Keep the users credentials
   * as the refreshtoken is not working on the endpoint.
   */
  @observable
  credentials = {
    username: undefined,
    password: undefined,
  };

  /**
   * @var {bool} Network loading indicator
   */
  @observable
  isLoading = false;

  /**
   * @var {Error} Keep error results for further analysis.
   */
  @observable
  error = null;

  /**
   * @var {bool} Flag to check if user is authenticated or not
   */
  @observable
  authenticated = false;

  /**
   * @var {object} Token information
   */
  @observable
  token = null;

  /**
   * Keep a history map of network requests for
   * throttling them.
   * @var {Map} The key is url.
   */
  @observable
  history = map();

  /**
   * Alert network errors.
   * Throttled to 1000ms.
   */
  @throttle(1000)
  showError(title, message) { // eslint-disable-line
    Alert.alert(title, message);
  }

  /**
   * Reset network authentications and history
   */
  reset() {
    this.authenticated = false;
    this.token = null;
    this.history = map();
  }

  /**
   * Use set username and password to authenticate and get
   * access token for further http requests.
   * @return {void}
   */
  @autobind
  @action
  authenticate(username, password) {

    if (username && password) {
      this.credentials = {
        username,
        password,
      };
    }

    // Get previous access token and when to update it.
    const {
      access_token: accessToken,
      updateTokenAt,
    } = this.token || {};

    // Check if token is expired
    const isTokenValid = (updateTokenAt >= new Date().getTime());

    DEBUG && console.log('isTokenValid: %o (%o vs %o)', isTokenValid, updateTokenAt, new Date().getTime()); // eslint-disable-line

    // Setup fetch options
    const opts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic bWFwcGFuLXBhc3N3b3JkOg==',
      },
      method: 'post',
      body: [
        'grant_type=password',
        `username=${encodeURIComponent(this.credentials.username)}`,
        `password=${encodeURIComponent(this.credentials.password)}`,
      ].join('&'),
    };

    if (accessToken && isTokenValid) {
      // All good, just continue
      return Promise.resolve();
    }

    // Get authentication token
    return fetch(`${this.apiUrl}/auth/tokens`, opts)
    .then(res => res.json())
    .then(action((res) => {

      DEBUG && console.log('Authentication Response: %o', res); // eslint-disable-line

      if (res.error) {
        return Promise.reject();
      }

      // Update token information
      this.token = {
        ...res,
        updateTokenAt: new Date(new Date().getTime() + (res.expires_in * 1000)).getTime(),
      };

      // Mark user as authenticated
      this.authenticated = true;
    }));
  }

  /**
   * Extended fetch method with credentials needed
   * to make http requests to the API.
   * @param {string} Url
   * @param {object} Options
   * @return {Promise}
   */
  @autobind
  @action
  fetch(url, opts = {}) {
    DEBUG && console.log('Fetching: %o', url); // eslint-disable-line
    const { headers = {}, ...rest } = opts;

    if (this.history.has(url) && !rest.force) {
      const { ts, data } = this.history.get(url);
      if (ts + (1000 * 5) > new Date().getTime()) {
        return Promise.resolve(data);
      }
    }

    // Set global loading state
    if (!rest.quiet) {
      this.isLoading = true;
    }
    this.error = null;

    return this.authenticate()
    .catch(() => {
      this.authenticated = false;
      Actions.login();
      throw Error('Authentication error');
    })
    .then(() => fetch(`${this.apiUrl}/${url}`, {
      headers: {
        Authorization: `Bearer ${this.token.access_token}`,
        ...headers,
      },
      ...rest,
    }))
    .then(action((res) => {
      const data = res.json();
      const ts = new Date().getTime();
      this.isLoading = false;
      this.history.set(url, { data, ts });
      return data;
    }))
    .catch(action((err) => {
      this.isLoading = false;
      if (err.message !== 'Authentication error') {
        this.showError('Network Error', err.message);
        this.error = err;
      }
      return null;
    }));
  }
}
