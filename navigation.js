import * as Screens from './screens';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

const stackOptions = {
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#0f3570',
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
  stackOptions
);

const SplashStack = createStackNavigator({ Splash: { screen: Screens.Splash } }, stackOptions);

const exportedStack = createSwitchNavigator(
{
  Splash: SplashStack,
  App: AppStack,
},
{
  initialRouteName: 'Splash',
}
);

export default exportedStack;
