import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-material-ui';
import { observer, inject } from 'mobx-react/native';
import { Actions } from 'react-native-mobx';
import { autobind } from 'core-decorators';
import { reset } from '../utils/storage';

@inject('ui', 'user', 'network')
@observer
export default class Settings extends Component {

  static propTypes = {
    ui: PropTypes.object,
    user: PropTypes.object,
    network: PropTypes.object,
  };

  componentWillMount() {
    const { user } = this.props;
    user.fetchUserInfo();
    user.fetchCreditCard();
    user.fetchPostboxLocations();
  }

  @autobind
  onClearStorage() {
    this.props.network.reset();
    reset();
    Actions.login();
  }

  @autobind
  onToggleLanguage() {
    const { language } = this.props.ui;
    this.props.ui.language = (language === 'EN') ? 'IS' : 'EN';
  }

  render() {
    return (
      <View style={s.root}>
        <Text>User settings (WIP)</Text>
        <Text>Language: {this.props.ui.language}</Text>
        <Button onPress={this.onToggleLanguage} text="Toggle language" />
        <Button onPress={this.onClearStorage} text="Sign out" />
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
});
