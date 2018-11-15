import * as Screens from './screens';
import { createStackNavigator } from 'react-navigation';

const Stack = createStackNavigator(
  {
    Splash: { screen: Screens.Splash },
    Lander: { screen: Screens.Lander },
    PDP: { screen: Screens.PDP },
    Player: { screen: Screens.Player },
    Search: { screen: Screens.Search },
    Profile: { screen: Screens.Profile },
  },
  {
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
  }
);

export default Stack;
