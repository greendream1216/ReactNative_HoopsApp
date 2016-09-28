
import * as containers from './index';
import _ from '../i18n';
import React from 'react';
import {connect} from 'react-redux';
import {navigation, user} from '../../actions';
import EventEmitter from 'EventEmitter';

import {TabBar as _TabBar, Navigator} from '../components';

class TabBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      action: null,
    };

    this.routeConfig = {
      tabs: {
        component: containers.TabBar,
      },

      home: {
        component: containers.Home,
        action: {
          organizer: {
            text: _('create'),
            icon: "actionAdd",
            onPress: () => props.onNavigate('createEvent', {}, false),
          },
          participant: {
            text: _('search'),
            icon: "actionSearch",
            onPress: () => props.onNavigate('search', {}, false),
          },
        },
      },

      eventDetails: {
        component: containers.EventDetails,
        action: {
          pressEmitter: new EventEmitter(),
          text: _('join'),
          textLarge: '',
        },
      },

      eventDashboard: {
        component: containers.EventDashboard,
        action: {
          pressEmitter: new EventEmitter(),
          text: _('cancel'),
          icon: "actionRemove",
          type: "action",
        },
      },

      eventMembers: {
        component: containers.EventMembers,
        action: {
          text: _('back'),
          icon: "actionBack",
          type: "action",
          onPress: () => props.onNavigateBack(),
        },
      },

      eventManage: {
        component: containers.EventManage,
        action: {
          text: _('create'),
        },
      },

      eventInvites: {
        component: containers.EventInvites,
        action: {
          pressEmitter: new EventEmitter(),
          text: _('inviteAll'),
          icon: "actionCheck",
          type: "actionDefault",
        },
      },

      manage: {
        component: containers.Manage,
        action: {
          text: _('create'),
          icon: "actionAdd",
          onPress: () => props.onNavigate('createEvent', {}, false),
        },
      },

      myEvents: {
        component: containers.MyEvents,
        action: {
          text: _('search'),
          icon: "actionSearch",
          onPress: () => props.onNavigate('search', {}, false),
        },
      },

      invitations: {
        component: containers.Invitations,
        action: {
          text: _('search'),
          icon: "actionSearch",
          onPress: () => props.onNavigate('search', {}, false),
        },
      },

      settings: {
        component: containers.Settings,
      },

      preferences: {
        component: containers.Preferences,
        action: {
          text: _('logout'),
          icon: "actionRemove",
          onPress: () => this.props.onLogOut(),
        },
      },

      profile: {
        component: containers.Profile,
        action: {
          text: _('create'),
          icon: "actionAdd",
          onPress: () => props.onNavigate('createEvent', {}, false),
        },
      },

      calendar: {
        component: containers.Calendar,
        action: {
          text: _('create'),
          icon: "actionAdd",
          onPress: () => props.onNavigate('createEvent', {}, false),
        },
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    let nav = this.props.navigation;
    let key = nav.tabKey;
    let nextNav = nextProps.navigation;
    let nextKey = nextNav.tabKey;

    if(key !== nextKey || nav.tabs[key].index !== nextNav.tabs[nextKey].index){
      this.setState({action: null});
    }
  }

  renderTab(){
    return (
      <Navigator
        key={this.props.navigation.tabKey}
        onNavigateBack={this.props.onNavigateBack}
        navigationState={this.props.navigation.tabs[this.props.navigation.tabKey]}
        routeConfig={this.routeConfig}
        onChangeAction={(action) => {
          this.setState({action});
        }}
        mode={this.props.user.mode}
        onToggleMode={this.props.onToggleMode}
      />
    );
  }

  render() {
    let navState = this.props.navigation;
    let tabState = navState.tabs[navState.tabKey];
    if(!tabState) {
      throw new Error(`tab '${navState.tabKey}' not defined in navigation state`);
    }
    let route = tabState.routes[tabState.index];

    let config = this.routeConfig[route.key];
    if(!config) {
      throw new Error(`TabBar config for ${route.key} is not defined`);
    }

    /**
     * If there are separate action configs for organiser / participant,
     * use those instead of the general action.config
     */
    let actionConfig;
    if(config.action) {
      if(this.props.user.mode === 'ORGANIZE' && config.action.organizer){
        actionConfig = config.action.organizer;
      } else if(this.props.user.mode === 'PARTICIPATE' && config.action.participant) {
        actionConfig = config.action.participant;
      } else {
        actionConfig = config.action;
      }
    }

    actionConfig = {
      ...actionConfig,
      ...this.state.action, //override static config with dynamic state
    };

    return (
      <_TabBar
        currentTab={this.props.navigation.tabKey}
        onTabPress={(key) => {
          this.props.onChangeTab(key);
          this.props.onHideMenu();
        }}
        actionText={actionConfig.text}
        actionTextLarge={actionConfig.textLarge}
        actionIcon={actionConfig.icon}
        actionType={actionConfig.type}
        onActionPress={() => {
          this.props.onHideMenu();
          actionConfig.onPress && actionConfig.onPress();
          actionConfig.pressEmitter && actionConfig.pressEmitter.emit('press');
        }}
        menuVisible={this.props.navigation.showMenu}
        onHideMenu={this.props.onHideMenu}
        onMenuPress={() => {
          if(this.props.navigation.showMenu) {
            this.props.onHideMenu();
          }else{
            this.props.onShowMenu();
          }
        }}
        mode={this.props.user.mode}
        user={this.props.user}
      >
        {this.renderTab()}
      </_TabBar>
    );
  }
}

export default connect(
  (state) => ({
    navigation: state.navigation,
    user: state.user,
  }),
  (dispatch) => ({
    onChangeTab: (key) => dispatch(navigation.changeTab(key)),
    onNavigateBack: () => dispatch(navigation.pop()),
    onNavigate: (key, props, subTab = true) => {
      dispatch(navigation.push({key, props}, subTab));
    },
    onLogOut: () => dispatch(user.logOut()),
    onShowMenu: () => dispatch(navigation.showMenu()),
    onHideMenu: () => dispatch(navigation.hideMenu()),
    onToggleMode: () => dispatch(user.toggleMode()),
  }),
)(TabBar);