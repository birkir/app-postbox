import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Toolbar } from 'react-native-material-ui';
import { observer, inject } from 'mobx-react/native';
import DeliveryEvent from '../components/delivery-event';

@inject('deliveries')
@observer
class Delivery extends Component {

  static propTypes = {
    deliveries: PropTypes.object, // eslint-disable-line
    registrationNumber: PropTypes.string,
  };

  componentWillMount() {
    const { deliveries, registrationNumber } = this.props;
    deliveries.fetchDelivery(registrationNumber);
  }

  render() {

    const {
      registrationNumber,
      deliveries,
    } = this.props;

    const {
      delivery,
      events,
    } = deliveries.getDelivery(registrationNumber);

    const lastCodeEvent = events.find(item => item.code);

    return (
      <View style={s.root}>

        {delivery && (
          <View style={s.detail}>
            <Text>FROM: {delivery.senderName}</Text>
            <Text>TO: {delivery.recipientName}</Text>
            <Text>Own status: {lastCodeEvent && lastCodeEvent.code}</Text>
            <Text>Status: {delivery.statusText}</Text>
            <Text>Location: {delivery.deliveryLocation}</Text>
            <Text>Payment: {delivery.totalAmount} {delivery.currency}</Text>
          </View>
        )}

        <View style={s.events}>
          <View style={s.mockPipe} />
          <Toolbar
            centerElement="Events"
          />
          <ScrollView style={s.eventsScroll}>
            {events.map((event, i) => (
              <DeliveryEvent
                key={`delivery_event_${i}`}
                isLastEvent={i === 0}
                isFirstEvent={(i + 1) === events.length}
                {...event}
              />
            ))}
            <View style={s.eventsScrollEmpty} />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 72,
    backgroundColor: '#f6f6f6',
  },

  header: {
    backgroundColor: '#f04240',
    padding: 15,
  },

  detail: {
    padding: 15,
    backgroundColor: '#fff',
  },

  events: {
    flex: 1,
    backgroundColor: '#fff',
  },

  eventsScroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  eventsScrollEmpty: {
    height: 100,
  },

  mockPipe: {
    position: 'absolute',
    left: 35,
    width: 6,
    height: 220,
    backgroundColor: '#f0f0f0',
  },
});

export default Delivery;
