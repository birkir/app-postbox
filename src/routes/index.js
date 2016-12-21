import React from 'react';
import { Scene } from 'react-native-mobx';
import Login from './Login';
import Messages from './Messages';
import Message from './Message';
import File from './File';
import Deliveries from './Deliveries';
import Delivery from './Delivery';
import Settings from './Settings';
import Drawer from '../components/drawer';
import Navbar from '../components/navbar';

export default ({ network, deliveries, messages }) => [
  <Scene
    key="login"
    component={Login}
    initial={!network.authenticated}
    hideNavBar
  />,
  <Scene
    key="drawer"
    initial={network.authenticated}
    component={Drawer}
  >
    <Scene key="root">
      <Scene
        key="messages"
        component={Messages}
        title={p => p.ui.i18n.TITLE_MESSAGES}
        navBar={Navbar}
        searchable={messages}
      />
      <Scene
        key="message"
        component={Message}
        title={p => p.ui.i18n.TITLE_MESSAGE}
        navBar={Navbar}
        showBack
      />
      <Scene
        key="file"
        component={File}
        title={p => p.ui.i18n.TITLE_FILE}
        navBar={Navbar}
        showBack
      />
      <Scene
        initial={network.authenticated}
        key="deliveries"
        component={Deliveries}
        title={p => p.ui.i18n.TITLE_DELIVERIES}
        navBar={Navbar}
        searchable={deliveries}
      />
      <Scene
        key="delivery"
        component={Delivery}
        title={p => p.ui.i18n.TITLE_DELIVERY(p.registrationNumber)}
        navBar={Navbar}
        showBack
      />
      <Scene
        key="settings"
        component={Settings}
        title={p => p.ui.i18n.TITLE_SETTINGS}
        navBar={Navbar}
      />
    </Scene>
  </Scene>,
];
