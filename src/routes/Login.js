import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Toolbar, Button, COLOR } from 'react-native-material-ui';
import TextField from 'react-native-md-textinput';
import { Actions } from 'react-native-mobx';
import { when, observable } from 'mobx';
import { autobind } from 'core-decorators';

class Login extends Component {

  static propTypes = {
    ui: PropTypes.object,
    network: PropTypes.object,
  };

  componentDidMount() {
    if (this.props.network.authenticated) {
      Actions.drawer();
    }
  }

  @autobind
  onLoginPress() {
    this.props.network
    .authenticate(this.username, this.password)
    .catch(error => (this.error = error))
    .then(() => when(() => this.props.network.authenticated, Actions.drawer));
  }

  @autobind
  onSSNChange(username) {
    this.username = username;
  }

  @autobind
  onPasswordChange(password) {
    this.password = password;
  }

  @observable
  error = null;

  @observable
  username = '';

  @observable
  password = '';

  render() {
    const { i18n } = this.props.ui;

    return (
      <View style={s.root}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent />
        <View style={s.statusBar} />
        <Toolbar centerElement="Login" />
        <View style={s.container}>
          {this.error && (
            <Text>{this.error.message}</Text>
          )}
          <TextField
            label={i18n.LABEL_SSN}
            keyboardType="email-address"
            onChangeText={this.onSSNChange}
            value={this.username}
          />
          <TextField
            label={i18n.LABEL_PASSWORD}
            secureTextEntry
            onChangeText={this.onPasswordChange}
            value={this.password}
          />
          <View style={s.button}>
            <Button
              text={i18n.BUTTON_LOGIN}
              accent
              onPress={this.onLoginPress}
            />
          </View>
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },

  statusBar: {
    backgroundColor: COLOR.red700,
    height: 24,
  },

  container: {
    flex: 1,
    padding: 25,
    paddingTop: 5,
  },

  button: {
    marginTop: 25,
  },
});

export default Login;
