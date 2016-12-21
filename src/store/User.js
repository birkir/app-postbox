import { action, observable, extendObservable } from 'mobx';

export default class User {

  constructor({ network, user }) {
    this.fetch = network.fetch;
    extendObservable(this, { ...user });
  }

  @observable
  language = 'en-us';

  @observable
  user = {};

  @observable
  info = {};

  @observable
  creditCard = {};

  @observable
  locations = [];

  /**
   * Fetch user information
   * @return {void}
   */
  @action
  async fetchUser() {
    this.user = await this.fetch('users/me');
  }

  @action
  async fetchUserInfo() {
    this.info = await this.fetch('postbox/userinfo');
  }

  @action
  async fetchCreditCard() {
    this.creditCard = await this.fetch('postbox/userinfo/creditcard');
  }

  @action
  async fetchPostboxLocations() {
    this.locations = await this.fetch('postbox/postlocations?filter=O');
  }
}
