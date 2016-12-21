import React, { Component, PropTypes } from 'react';
import { ListView, View, Text, StyleSheet, RefreshControl, Platform } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { autobind } from 'core-decorators';
import { when, observable } from 'mobx';
import dataStore from '../utils/data-store';
import MessagesItem from '../components/messages-item';

@inject('ui', 'messages')
@observer
export default class Messages extends Component {

  static propTypes = {
    ui: PropTypes.object,
    messages: PropTypes.object,
  };

  componentWillMount() {
    this.props.messages.fetchAll();
  }

  @autobind
  onRefreshMessages() {
    this.isRefreshing = true;
    this.props.messages.fetchAll({ force: true, quiet: true });
    when(
      () => !this.props.messages.isLoadingAll,
      () => (this.isRefreshing = false),
    );
  }

  @autobind
  searchFilter(row) {
    const { searchText } = this.props.messages;
    return `${row.senderName} ${row.subject}`.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
  }

  @observable
  isRefreshing = false;

  render() {

    const { i18n } = this.props.ui;
    const {
      isInitial,
      isSearching,
      messages = { peek: () => [] },
    } = this.props.messages;

    let rows = messages.peek();

    if (isSearching) {
      rows = rows.filter(this.searchFilter);
    }

    const noResults = (rows.length === 0);

    return (
      <View style={s.root}>

        {rows.length > 0 && (
          <ListView
            dataSource={dataStore.cloneWithRows(rows)}
            renderRow={row => (
              <MessagesItem {...row} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={this.isRefreshing}
                onRefresh={this.onRefreshMessages}
              />
            }
          />
        )}

        {(noResults || isInitial) && (
          <View style={s.message}>
            <Text style={s.messageText}>
              {(noResults ? i18n.NO_RESULTS : i18n.INITIAL_FETCHING).toUpperCase()}
            </Text>
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

  message: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageText: {
    fontWeight: '500',
    color: '#888',
    fontSize: 15,
  },
});
