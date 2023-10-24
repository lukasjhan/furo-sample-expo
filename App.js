import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

const CLIENT_ID = ''; // Insert your furo project's client id

export default function App() {
  const linking = {
    prefixes: ['exp://'],
    config: {
      screens: {
        Home: '*',
      },
    },
  };
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ route }) {
  const [data, setData] = React.useState();

  React.useEffect(() => {
    Linking.addEventListener('url', ({ url }) => {
      const query = url.split('?');
      if (query.length < 2) return;
      const [, code] = query[1].split('=');
      if (code) {
        (async () => {
          try {
            const response = await authenticateWithCode(code);
            const { access_token } = response;
            setData(access_token);
          } catch (e) {
            console.log('error: ', e.response.data);
          }
        })();
      }
    });
  }, []);
  const loginUrl = `https://auth.furo.one/login/${CLIENT_ID}`;

  const loginWithRedirect = async () => {
    Linking.openURL(loginUrl);
  };

  const authenticateWithCode = async (code) => {
    const { data } = await axios.post(
      'https://api.furo.one/sessions/code/authenticate',
      { code },
      { headers: { origin: 'exp://' } }
    );
    return data;
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>
        [Furo] React Native Tutorial
      </Text>
      <View style={{ marginTop: 10, width: '80%' }}>
        <Text>{data}</Text>
      </View>
      <StatusBar style="auto" />
      {!data ? (
        <Button title={'Sign In'} onPress={loginWithRedirect} />
      ) : (
        <Button title={'Clear'} onPress={() => setData()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
