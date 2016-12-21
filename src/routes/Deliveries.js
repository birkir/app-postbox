import React, { Component, PropTypes } from 'react';
import { ListView, View, Text, StyleSheet, RefreshControl, Platform } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { autobind } from 'core-decorators';
import { when, observable } from 'mobx';
import dataStore from '../utils/data-store';
import DeliveriesItem from '../components/deliveries-item';

@inject('ui', 'deliveries')
@observer
class Deliveries extends Component {

  static propTypes = {
    ui: PropTypes.object,
    deliveries: PropTypes.object,
  };

  componentWillMount() {
    this.props.deliveries.fetchAll();
  }

  @autobind
  onRefreshDeliveries() {
    this.isRefreshing = true;
    this.props.deliveries.fetchAll({ force: true, quiet: true });
    when(
      () => !this.props.deliveries.isLoadingAll,
      () => (this.isRefreshing = false),
    );
  }

  @autobind
  searchFilter(row) {
    const { searchText } = this.props.deliveries;
    return `${row.registrationNumber} ${row.senderName}`.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
  }

  @observable
  isRefreshing = false;

  render() {

    const { i18n } = this.props.ui;
    const {
      isInitial,
      isSearching,
      deliveries = { peek: () => [] },
    } = this.props.deliveries;

    let rows = deliveries.peek();

    if (isSearching) {
      rows = rows.filter(this.searchFilter);
    }

    const noResults = (rows.length === 0);

    return (
      <View style={s.root}>

        {rows.length > 0 && (
          <ListView
            dataSource={dataStore.cloneWithRows(rows)}
            loadData={this.onRefreshDeliveries}
            renderRow={row => <DeliveriesItem {...row} />}
            refreshControl={
              <RefreshControl
                refreshing={this.isRefreshing}
                onRefresh={this.onRefreshDeliveries}
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

export default Deliveries;
