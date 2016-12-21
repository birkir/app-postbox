import React, { Component, PropTypes } from 'react';
import { Text, Linking } from 'react-native';
import { ListItem } from 'react-native-material-ui';
import { autobind } from 'core-decorators';
import { Actions } from 'react-native-mobx';

export default class MessageFile extends Component {

  static propTypes = {
    id: PropTypes.number,
    index: PropTypes.number,
    name: PropTypes.string,
    path: PropTypes.string,
  };

  @autobind
  onDownloadPress() {
    const { path } = this.props;
    Linking.canOpenURL(path)
    .then(supported => supported && Linking.openURL(path));
  }

  render() {
    const {
      id,
      index,
      name,
    } = this.props;

    return (
      <ListItem
        centerElement={<Text>{name}</Text>}
        rightElement="file-download"
        onRightElementPress={this.onDownloadPress}
        onPress={() => Actions.file({ id, index })}
        divider
      />
    );
  }
}
