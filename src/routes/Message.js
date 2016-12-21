import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Divider } from 'react-native-material-ui';
import { observer, inject } from 'mobx-react/native';
import MessageFile from '../components/message-file';

@inject('messages')
@observer
export default class Message extends Component {

  static propTypes = {
    id: PropTypes.number,
    messages: PropTypes.object,
  };

  componentWillMount() {
    const { messages, id } = this.props;
    messages.fetchMessage(id);
    const inList = messages.messages.find(msg => msg.id === id);
    if (inList) {
      inList.opened = true;
    }
  }

  render() {
    const { messages, id } = this.props;
    const message = messages.message.get(id) || {};

    const { subject, senderName, files, deliveryDate, trash } = message; // eslint-disable-line

    return (
      <View style={s.root}>
        {subject && (
          <View>
            <View style={s.detail}>
              <Text style={s.subject}>{subject}</Text>
              <Text style={s.sender}>{senderName}</Text>
            </View>
            <Divider />
            {files.map((file, i) => (
              <MessageFile
                key={`file_${i}`}
                id={id}
                index={i}
                name={file.name}
                path={file.signedPath}
                size={file.size}
              />
            ))}
          </View>
        )}
      </View>
    );
  }
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: Platform.select({
      ios: 72,
      android: 50,
    }),
  },

  detail: {
    padding: 15,
  },

  subject: {
    fontWeight: '500',
    fontSize: 18,
    paddingBottom: 4,
  },

  sender: {
    fontSize: 16,
  },
});
