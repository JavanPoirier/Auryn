import { Lander, PDP, Player } from './screens';
import { createStackNavigator } from 'react-navigation';

const Stack = createStackNavigator(
  {
    Lander: { screen: Lander },
    PDP: { screen: PDP },
    Player: { screen: Player }
  },
  {
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#000',
    },
    transitionConfig: () => ({
      transitionSpec: {},
      screenInterpolator: () => {
      }
    })
  }
);

export default Stack
