import React, { PropTypes } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Actions } from 'react-native-mobx';
import { Avatar, ListItem } from 'react-native-material-ui';
import moment from 'moment';

export default function MessagesItem({
  id,
  subject,
  senderName,
  deliveryDate,
  opened,
  icon200,
}) {
  const date = moment(deliveryDate);
  const image = <Avatar image={<Image style={s.icon} source={{ uri: icon200 }} />} />;
  const style = { primaryText: {} };

  if (!opened) {
    style.primaryText.fontWeight = '600';
  }

  return (
    <ListItem
      leftElement={image}
      numberOfLines={3}
      centerElement={{
        primaryText: subject,
        secondaryText: `${senderName}\n${date.format('D. MMM YYYY')}`,
      }}
      onPress={() => Actions.message({ id })}
      style={style}
      divider
    />
  );
}

const s = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

MessagesItem.propTypes = {
  id: PropTypes.number,
  senderName: PropTypes.string,
  subject: PropTypes.string,
  deliveryDate: PropTypes.number,
  opened: PropTypes.bool,
  icon200: PropTypes.string,
};
