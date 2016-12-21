import React, { PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLOR, Icon } from 'react-native-material-ui';
import moment from 'moment';

export default function DeliveryEvent({
  isFirstEvent,
  isLastEvent,
  timestamp,
  location,
  description,
  icon,
}) {
  const date = moment(timestamp);

  const rowStyles = [s.row];

  if (isFirstEvent) {
    rowStyles.push(s.firstRow);
    rowStyles.push(s.firstPipe);
  }

  if (isLastEvent) {
    rowStyles.push(s.lastRow);
  }

  return (
    <View style={rowStyles}>
      <View style={s.status}>
        <View style={s.pip} />
        <View style={s.bullet}>
          {icon && <Icon name={icon} color="#fff" size={20} style={{ backgroundColor: 'transparent' }} />}
        </View>
      </View>
      <View style={s.details}>
        <Text style={s.date}>{date.format('DD. MMM YYYY, hh:mm')}</Text>
        <Text style={s.title}>{description}</Text>
        <Text style={s.location}>{location}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingLeft: 10,
  },

  rowFirst: {
    paddingBottom: 20,
  },

  status: {
    width: 64,
    paddingTop: 20,
  },

  details: {
    flex: 1,
    paddingTop: 20,
  },

  bullet: {
    position: 'absolute',
    top: 23,
    left: 10,
    width: 38,
    height: 38,
    borderRadius: 38,
    backgroundColor: COLOR.grey400,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },

  pipe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 25,
    width: 6,
    backgroundColor: '#f0f0f0',
  },

  firstPipe: {
    bottom: undefined,
    height: 30,
  },

  date: {
    color: '#aaa',
    paddingBottom: 2,
  },

  title: {
    fontWeight: '500',
    color: '#000',
    fontSize: 16,
    paddingBottom: 5,
  },

  location: {
    color: '#aaa',
  },
});

DeliveryEvent.propTypes = {
  isFirstEvent: PropTypes.bool,
  isLastEvent: PropTypes.bool,
  timestamp: PropTypes.string,
  location: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
};
