import { action, observable, computed, map, asMap, extendObservable } from 'mobx';

export default class Messages {

  constructor({ network, messages = {} }) {
    this.fetch = network.fetch;
    extendObservable(this, {
      ...messages,
      message: asMap(messages.message),
    });
  }

  @observable
  isInitial = true;

  @observable
  isLoadingAll = false;

  @observable
  isSearching = false;

  @observable
  searchText = '';

  @observable
  messages = [];

  @observable
  message = map();

  @computed
  get unread() {
    return this.messages.filter(message => !message.opened).length;
  }

  @action
  async fetchAll(opts) {
    this.isLoadingAll = true;
    this.messages = await this.fetch('messages?order=desc&trash=false', opts);
    this.isLoadingAll = false;
    this.isInitial = false;
  }

  @action
  async fetchMessage(messageId) {
    const message = await this.fetch(`messages/${messageId}`);
    const files = await this.fetch(`messages/${messageId}/files`);
    const pages = await Promise.all(files.map((file, i) => this.fetch(`messages/${messageId}/files/${i}/pages`)));
    message.files = files.map((file, i) => ({
      ...file,
      pages: pages[i].pages,
    }));
    this.message.set(messageId, message);
  }
}
