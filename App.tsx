import './platform-polyfills'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { BskyAgent, AtpSessionData } from '@atproto/api'
import { fetchHandler } from './fetch-polyfill'

export default function App() {
  const agent = React.useMemo(() => {
    BskyAgent.configure({ fetch: fetchHandler })
    return new BskyAgent({ service: 'https://bsky.social/' })
  }, [])
  const [session, setSession] = React.useState<AtpSessionData | undefined>(
    agent.session
  )

  return (
    <View style={styles.container}>
      {session ? (
        <Text>Logged in as {session.handle}</Text>
      ) : (
        <LoginForm agent={agent} setSession={setSession} />
      )}
      <StatusBar style="auto" />
    </View>
  )
}

function LoginForm({
  agent,
  setSession,
}: {
  agent: BskyAgent
  setSession: (session: AtpSessionData) => void
}) {
  const [handle, setHandle] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  const onPressSignin = React.useCallback(async () => {
    setError('')
    try {
      await agent.login({ identifier: handle, password })
      setSession(agent.session)
    } catch (e) {
      setError(e.toString())
    }
  }, [agent, handle, password, setError, setSession])

  return (
    <View>
      <TextInput
        placeholder="Handle"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        style={styles.textInput}
        value={handle}
        onChangeText={setHandle}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.textInput}
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text>{error}</Text> : undefined}
      <Button title="Sign in" onPress={onPressSignin} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#888',
    width: 200,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
})
