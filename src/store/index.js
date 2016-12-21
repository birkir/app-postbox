import Deliveries from './Deliveries';
import User from './User';
import Messages from './Messages';
import Network from './Network';
import UI from './UI';

export default class Store {
  constructor(data) {
    Object.assign(this, data);
    this.network = new Network(this);
    this.deliveries = new Deliveries(this);
    this.messages = new Messages(this);
    this.user = new User(this);
    this.ui = new UI(this);
  }
}
