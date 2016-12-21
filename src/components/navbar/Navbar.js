import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { Actions } from 'react-native-mobx';
import { COLOR, Toolbar } from 'react-native-material-ui';
import { autobind } from 'core-decorators';

export default class Navbar extends Component {

  static propTypes = {
    network: PropTypes.object, // eslint-disable-line
    deliveries: PropTypes.object, // eslint-disable-line
    title: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
    searchable: PropTypes.object,
    isSearching: PropTypes.any, // eslint-disable-line
    searchText: PropTypes.any, // eslint-disable-line
    getTitle: PropTypes.func,
    navigationState: PropTypes.object, // eslint-disable-line
  };

  componentWillReceiveProps() {
    const { searchable } = this.props;
    if (!searchable) return;
    const { searchText } = searchable;
    if (searchText !== '') {
      this.toolbar.setState({ searchValue: searchText });
      this.resetBackButton();
    }
  }

  @autobind
  onLeftPress() {
    if (!this.showBackButton) {
      Actions.refresh({ key: 'drawer', isDrawerOpen: true });
    } else {
      Actions.pop();
    }
  }

  @autobind
  onChangeText(text) {
    this.props.searchable.searchText = text;
    this.resetBackButton();
  }

  @autobind
  onSearchPressed() {
    this.props.searchable.searchText = '';
    this.props.searchable.isSearching = true;
    this.resetBackButton();
  }

  @autobind
  onSearchClosed() {
    this.props.searchable.isSearching = false;
  }

  getTitle() {
    let { title } = this.props;
    const { getTitle } = this.props;

    if (getTitle && typeof getTitle === 'function') {
      title = getTitle(this.props);
    }

    if (typeof title === 'function') {
      return title(this.props);
    }

    return title;
  }

  @autobind
  resetBackButton() {
    if (Platform.OS === 'ios' && this.toolbar) {
      this.toolbar.backButtonListener = { remove: () => {} };
    }
  }

  get showBackButton() {
    const { navigationState } = this.props;
    const { index, children } = navigationState;
    const component = children[index];
    return component.showBack;
  }

  renderLeftElement() {
    if (!this.showBackButton) {
      return 'menu';
    }
    return 'arrow-back';
  }

  renderRightElement() {
    if (this.props.network.isLoading) {
      return (
        <ActivityIndicator color="#fff" style={{ paddingRight: 10 }} />
      );
    }
    return null;
  }

  render() {
    const isSearching = this.props.searchable && this.props.searchable.isSearching;
    return (
      <View style={s.host}>
        <StatusBar
          backgroundColor={COLOR.red800}
          barStyle="light-content"
        />
        {Platform.OS === 'ios' && <View style={s.statusBar} />}
        <Toolbar
          ref={ref => (this.toolbar = ref)}
          leftElement={this.renderLeftElement()}
          onLeftElementPress={this.onLeftPress}
          centerElement={this.getTitle()}
          rightElement={this.renderRightElement()}
          isSearchActive={isSearching}
          searchable={this.props.searchable ? {
            autoFocus: true,
            placeholder: 'Search',
            onChangeText: this.onChangeText,
            onSearchPressed: this.onSearchPressed,
            onSearchClosed: this.onSearchClosed,
          } : undefined}
        />
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },

  statusBar: {
    height: 22,
    backgroundColor: COLOR.red800,
  },
});
