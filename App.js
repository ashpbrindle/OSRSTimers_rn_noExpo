import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import HomeScreen from './screens/HomeScreen'

const navigatior = createStackNavigator(
  {
    Home: {screen: HomeScreen}
  },
  {
    initialRouteName: "Home"
  }
)

export default createAppContainer(navigatior)