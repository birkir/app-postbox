import { observable, computed, extendObservable } from 'mobx';

export default class UI {

  constructor({ ui = {} }) {
    extendObservable(this, {
      language: ui.language,
    });
  }

  @observable
  language = 'EN';

  // Map
  langmap = {
    default: {
      TITLE_MESSAGES: 'Messages',
      TITLE_MESSAGE: 'Message',
      TITLE_FILE: 'Message File',
      TITLE_DELIVERIES: 'Deliveries',
      TITLE_DELIVERY(registrationNumber) { return `${registrationNumber}`; },
      TITLE_SETTINGS: 'Settings',
      LABEL_SSN: 'Social security number',
      LABEL_PASSWORD: 'Password',
      BUTTON_LOGIN: 'Login',
      NO_RESULTS: 'No results',
      INITIAL_FETCHING: 'Fetching data',
    },
  };

  @computed
  get i18n() {
    return {
      ...this.langmap.default,
      ...this.langmap[this.language],
    };
  }

}
