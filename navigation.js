import * as Screens from './screens';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

const stackOptions = {
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#143672',
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
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
  stackOptions,
);

const rootNavigationStack = createSwitchNavigator(
{
  Splash: { screen: Screens.Splash },
  AppStack: { screen: AppStack },
},
{
  initialRouteName: 'Splash',
},
);

export default rootNavigationStack;
