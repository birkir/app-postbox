import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Image, StyleSheet, Platform, Dimensions } from 'react-native';
import { observer, inject } from 'mobx-react/native';

@inject('messages')
@observer
export default class File extends Component {

  static propTypes = {
    messages: PropTypes.object,
    id: PropTypes.number,
    index: PropTypes.number,
  };

  componentWillMount() {
    const { messages, id } = this.props;
    messages.fetchMessage(id);
  }

  render() {
    const { messages, id, index } = this.props;
    const message = messages.message.get(id) || {};
    const { files } = message;
    const file = files.length > index && files[index];

    return (
      <ScrollView style={s.root}>
        {file && file.pages.map((page, i) => (
          <View
            key={`page_${i}`}
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              padding: 15,
            }}
          >
            <Image
              resizeMode="contain"
              style={{ flex: 1 }}
              source={{ uri: page.signedUrl }}
            />
          </View>
        ))}
      </ScrollView>
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
});
