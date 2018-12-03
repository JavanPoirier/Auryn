import * as Screens from './screens';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

const stackOptions = {
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#143672',
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 0,
    },
    screenInterpolator: () => { },
  }),
};

const AppStack = createStackNavigator(
{
    Lander: { screen: Screens.Lander },
    PDP: { screen: Screens.PDP },
    Search: { screen: Screens.Search },
    Profile: { screen: Screens.Profile },
  },
  {
    ...stackOptions,
    initialRouteName: 'Lander',
  }
);

const SplashStack = createStackNavigator(
  { Splash: { screen: Screens.Splash } },
  {
    ...stackOptions,
    initialRouteName: 'Splash',
  }
);

const rootNavigationStack = createSwitchNavigator({
  Splash: SplashStack,
  App: AppStack,
});

export default rootNavigationStack;
