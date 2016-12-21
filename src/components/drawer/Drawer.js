import React, { PropTypes } from 'react';
import { Image, View } from 'react-native';
import { Drawer, Avatar } from 'react-native-material-ui';
import { DefaultRenderer, Actions } from 'react-native-mobx';
import NativeDrawer from 'react-native-drawer';

export default class NavigationDrawer extends React.Component {

  static propTypes = {
    user: PropTypes.object, // eslint-disable-line
    navigationState: PropTypes.shape({
      children: PropTypes.array,
    }),
    onNavigate: PropTypes.func,
  };

  get currentState() {
    const { navigationState } = this.props;
    let state = navigationState;
    while (state.children) {
      state = state.children[state.index];
    }
    return state;
  }

  renderAvatar() {
    const { signedAvatar, name } = this.props.user.user || {};
    const text = (!signedAvatar && name) ? name.substr(2) : undefined;
    const image = signedAvatar && (
      <Image
        style={{ width: 56, height: 56, borderRadius: 28 }}
        source={{ uri: signedAvatar }}
      />
    );

    return <Avatar text={text} image={image} />;
  }

  render() {
    const { navigationState, onNavigate, user } = this.props;
    const { children, key, isDrawerOpen } = navigationState;
    const active = this.currentState;

    const styles = {
      drawer: { shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 8 },
      main: { paddingLeft: 8, backgroundColor: 'transparent' },
      mainOverlay: { backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0 },
    };

    const createMenuItem = (sceneKey, icon, value) => ({
      icon,
      value,
      active: (active.sceneKey === sceneKey),
      onPress: () => {
        this.drawer.close();
        Actions[sceneKey]();
      },
    });

    const menu = [
      createMenuItem('messages', 'mail', 'Messages'),
      createMenuItem('deliveries', 'inbox', 'Deliveries'),
    ];

    const submenu = [
      createMenuItem('settings', 'settings', 'Settings'),
    ];

    return (
      <NativeDrawer
        ref={ref => (this.drawer = ref)}
        type="overlay"
        styles={styles}
        open={isDrawerOpen}
        onOpen={() => Actions.refresh({ key, isDrawerOpen: true })}
        onClose={() => Actions.refresh({ key, isDrawerOpen: false })}
        content={
          <Drawer>
            <Drawer.Header>
              <View style={{ height: 22 }} />
              <Drawer.Header.Account
                avatar={this.renderAvatar()}
                footer={{
                  dense: true,
                  ...(user.user && {
                    centerElement: {
                      primaryText: user.user.name,
                      secondaryText: user.user.email || '',
                    },
                  }),
                }}
              />
            </Drawer.Header>
            <Drawer.Section divider items={menu} />
            <Drawer.Section items={submenu} />
          </Drawer>
        }
        tapToClose
        openDrawerOffset={56}
        closedDrawerOffset={-8}
        panCloseMask={56}
        negotiatePan
        tweenHandler={ratio => ({
          mainOverlay: { opacity: ratio },
        })}
      >
        <DefaultRenderer navigationState={children[0]} onNavigate={onNavigate} />
      </NativeDrawer>
    );
  }
}
