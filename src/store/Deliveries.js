import { action, observable, map, asMap, extendObservable } from 'mobx';
import parseStatus from '../utils/parse-delivery-status';

export default class Deliveries {

  constructor({ network, deliveries = {} }) {
    this.fetch = network.fetch;
    extendObservable(this, {
      ...deliveries,
      delivery: asMap(deliveries.delivery),
    });
  }

  @observable
  isInitial = true;

  @observable
  isLoadingAll = false;

  @observable
  deliveries = [];

  @observable
  delivery = map();

  @observable
  isSearching = false;

  @observable
  searchText = '';

  @action
  async fetchAll(opts) {

    const res = [];

    // Set is loading state
    this.isLoadingAll = true;

    // Get active deliveries
    const active = await this.fetch('postbox/deliveries?active=true&rows=20&type=to', opts);
    const inactive = await this.fetch('postbox/deliveries?active=false&rows=20&type=to', opts);

    if (active && active.deliveries) {
      res.push(...active.deliveries);
    }

    if (inactive && inactive.deliveries) {
      res.push(...inactive.deliveries);
    }

    // Finally set deliveries
    this.deliveries = res;

    // Set done loading state
    this.isLoadingAll = false;
    this.isInitial = false;
  }

  @action
  fetchDelivery(registrationNumber) {
    const { delivery } = this;
    const old = delivery.get(registrationNumber) || {};
    delivery.set(registrationNumber, { ...old, isLoading: true });
    return this.fetch(`postbox/deliveries/${registrationNumber}`)
    .then(action((res) => {
      const events = res.events
      .map(item => ({
        ...item,
        ...parseStatus(item.description, item.location),
      }))
      .reverse()
      .map((e, i, evts) => {
        if (i > 0 && evts[i - 1].code === 'DELIVERED') {
          const { color, icon } = evts[i - 1];
          return { ...e, color, icon };
        }
        return e;
      })
      .reverse();

      delivery.set(registrationNumber, {
        lastFetched: new Date().getTime(),
        isLoading: false,
        ...res,
        events,
      });
    }))
    .catch((err) => {
      console.log('Too many requests: %o', err);
    });
  }

  getDelivery(registrationNumber) {
    return {
      isLoading: true,
      delivery: {},
      events: [],
      ...this.delivery.get(registrationNumber),
    };
  }

  // Check if we have anything new since last time
  // Note: only checking active deliveries
  async checkUpdates() {
    const updates = [];
    const active = await this.fetch('postbox/deliveries?active=true&rows=20&type=to');

    (active.deliveries || []).forEach(({ registrationNumber, statusCode, statusText }) => {
      // Check if we already have this delivery.
      const hasDelivery = this.deliveries.find(d => d.registrationNumber === registrationNumber);
      if (!hasDelivery) {
        updates.push({
          registrationNumber,
          message: `${registrationNumber} discovered`,
        });
      } else if (hasDelivery.statusCode !== statusCode) {
        updates.push({
          registrationNumber,
          message: `${registrationNumber} is now ${statusText}`,
        });
      }
    });

    return updates;
  }
}
