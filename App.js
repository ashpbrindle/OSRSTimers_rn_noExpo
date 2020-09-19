import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import HomeScreen from './screens/HomeScreen'

const navigatior = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      },
    }
  },
  {
    initialRouteName: "Home"
  }
)

export default createAppContainer(navigatior)