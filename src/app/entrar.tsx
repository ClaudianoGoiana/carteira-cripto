// Autentica o usuário e encaminha para a área protegida do aplicativo.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import AuthForm, { authStyles } from '../components/AuthForm/AuthForm';
import { entrar, inicializarBanco, obterSessao } from '../db';

export default function Entrar() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    obterSessao().then((sessao) => sessao && router.replace('/')).catch(() => undefined);
  }, []);

  async function submeter() {
    setErro('');
    setCarregando(true);
    try {
      await inicializarBanco();
      await entrar(email, senha);
      router.replace('/');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthForm>
      <Text style={authStyles.titulo}>Entrar</Text>
      <Text style={authStyles.texto}>Acesse sua conta local.</Text>
      {erro ? <Text style={authStyles.erro}>{erro}</Text> : null}
      <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="E-mail" placeholderTextColor="#000000" style={authStyles.campo} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" placeholderTextColor="#000000" secureTextEntry style={authStyles.campo} value={senha} onChangeText={setSenha} />
      <Pressable disabled={carregando} onPress={submeter} style={authStyles.botao}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={authStyles.botaoTexto}>Entrar</Text>}
      </Pressable>
      <Pressable onPress={() => router.push('/criar-conta')}>
        <Text style={authStyles.link}>Ainda não tenho conta</Text>
      </Pressable>
    </AuthForm>
  );
}
