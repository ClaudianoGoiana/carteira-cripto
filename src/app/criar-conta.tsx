// Formulário de criação da conta local do usuário.
import { useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import AuthForm, { authStyles } from '../components/AuthForm/AuthForm';
import { criarUsuario } from '../db';

export default function CriarConta() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function submeter() {
    setErro('');
    if (!nome.trim() || !email.includes('@') || senha.length < 6) {
      setErro('Informe nome, e-mail válido e senha com pelo menos 6 caracteres.');
      return;
    }
    try {
      await criarUsuario(nome, email, senha);
      router.replace('/entrar');
    } catch {
      setErro('Este e-mail já está cadastrado.');
    }
  }

  return (
    <AuthForm>
      <Text style={authStyles.titulo}>Criar conta</Text>
      <Text style={authStyles.texto}>Seus dados ficam neste dispositivo.</Text>
      {erro ? <Text style={authStyles.erro}>{erro}</Text> : null}
      <TextInput placeholder="Nome" placeholderTextColor="#000000" style={authStyles.campo} value={nome} onChangeText={setNome} />
      <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="E-mail" placeholderTextColor="#000000" style={authStyles.campo} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha (mínimo 6 caracteres)" placeholderTextColor="#000000" secureTextEntry style={authStyles.campo} value={senha} onChangeText={setSenha} />
      <Pressable onPress={submeter} style={authStyles.botao}><Text style={authStyles.botaoTexto}>Criar conta</Text></Pressable>
      <Pressable onPress={() => router.back()}><Text style={authStyles.link}>Já tenho uma conta</Text></Pressable>
    </AuthForm>
  );
}
