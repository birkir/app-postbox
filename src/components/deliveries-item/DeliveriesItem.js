import React, { PropTypes } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-mobx';
import { COLOR, Icon } from 'react-native-material-ui';
import parseStatus from '../../utils/parse-delivery-status';

export default function DeliveriesItem({
  senderName,
  registrationNumber,
  statusText,
  deliveryLocation,
}) {
  const status = parseStatus(statusText, deliveryLocation);
  return (
    <TouchableHighlight onPress={() => Actions.delivery({ registrationNumber })}>
      <View style={s.host}>
        <View style={s.left}>
          <View style={s.badge}>
            <Icon name={status.icon} color="#fff" style={iconStyle} />
          </View>
        </View>
        <View style={s.right}>
          <Text style={s.number}>{registrationNumber}</Text>
          <Text style={s.sender}>{senderName}</Text>
          <Text style={s.location}>{deliveryLocation}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const iconStyle = {
  backgroundColor: 'transparent',
  width: 24,
  height: 24,
};

const s = StyleSheet.create({
  host: {
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#e9e9e9',
    borderBottomWidth: 1,
  },

  left: {
    paddingRight: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLOR.grey400,
    justifyContent: 'center',
    alignItems: 'center',
  },

  number: {
    fontWeight: '600',
    fontSize: 13,
  },

  sender: {
    fontSize: 12,
  },

  location: {
    color: '#aaa',
    fontSize: 12,
  },
});

DeliveriesItem.propTypes = {
  senderName: PropTypes.string,
  registrationNumber: PropTypes.string,
  statusText: PropTypes.string,
  deliveryLocation: PropTypes.string,
};
