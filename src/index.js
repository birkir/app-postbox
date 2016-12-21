import React, { Component } from 'react';
import { Router } from 'react-native-mobx';
import { ThemeProvider } from 'react-native-material-ui';
import { spy, observable } from 'mobx';
import { autobind, throttle } from 'core-decorators';
import { read, write } from './utils/storage';
import routes from './routes';
import Store from './store';
import theme from './utils/theme';

if (!__DEV__) { // eslint-disable-line
  require('./utils/notifications'); // eslint-disable-line
}

/**
 * Postbox React Native App
 */
export default class Postbox extends Component {

  /**
   * Fired when component did mount
   * - read data from storage and create new Store.
   * - listen to all mobx actions and persist data.
   */
  async componentDidMount() {
    this.store = new Store(await read());
    this.store.user.fetchUser();
    this.isStoreLoaded = true;
    spy(this.persistStore);
  }

  /**
   * Persist store in App Storage
   */
  @autobind
  @throttle(1000)
  async persistStore() {
    return write(this.store);
  }

  /**
   * @var {bool} Is store loaded successfully.
   */
  @observable
  isStoreLoaded = false;

  /**
   * Render method
   */
  render() {

    if (!this.isStoreLoaded) {
      return null;
    }

    return (
      <ThemeProvider uiTheme={theme}>
        <Router {...this.store}>
          {routes(this.store)}
        </Router>
      </ThemeProvider>
    );
  }
}
