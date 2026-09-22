
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppstackParamList } from '../types/navigation';
import { LoginScreen } from '../screens/LoginScreen';
import { PatientScreen } from '../screens/PatientScreen';
import { ProfessionalScreen } from '../screens/ProfessionalScreen';

const Stack = createNativeStackNavigator<AppstackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name='Login'
          component={LoginScreen}
        />
        <Stack.Screen
          name='Patient'
          component={PatientScreen}
        />
        <Stack.Screen
          name='Professional'
          component={ProfessionalScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
