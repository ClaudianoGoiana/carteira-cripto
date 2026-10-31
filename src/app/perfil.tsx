// Perfil de investimento, dados pessoais, CPF e resumo patrimonial.
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { atualizarPerfil, confirmarCpf, obterPerfil, obterResumoInvestimento, sair, Perfil, ResumoInvestimento } from '../db';
import { cores } from '../estilos/global';

function dinheiro(valor: number) {
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 2) return numeros.length ? `(${numeros}` : '';
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function formatarDataNascimento(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

export default function PerfilScreen() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [resumo, setResumo] = useState<ResumoInvestimento | null>(null);
  const [form, setForm] = useState({ nome: '', sobrenome: '', email: '', telefone: '', dataNascimento: '', endereco: '' });
  const [cpf, setCpf] = useState('');
  const [editando, setEditando] = useState(false);
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(async () => {
    try {
      const atual = await obterPerfil();
      if (!atual) {
        router.replace('/entrar');
        return;
      }
      setPerfil(atual);
      setForm({
        nome: atual.nome,
        sobrenome: atual.sobrenome,
        email: atual.email,
        telefone: atual.telefone,
        dataNascimento: atual.dataNascimento,
        endereco: atual.endereco,
      });
      setResumo(await obterResumoInvestimento());
    } catch {
      router.replace('/entrar');
    }
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  function alterar(campo: keyof typeof form, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvarPerfil() {
    if (!form.nome.trim() || !form.sobrenome.trim() || !form.email.includes('@')) {
      setAviso('Informe nome, sobrenome e e-mail válido.');
      return;
    }
    try {
      const atualizado = await atualizarPerfil(form);
      setPerfil(atualizado);
      setEditando(false);
      setAviso('Dados do perfil atualizados com sucesso.');
    } catch (error) {
      setAviso(error instanceof Error ? error.message : 'Não foi possível atualizar o perfil.');
    }
  }

  async function confirmar() {
    try {
      const atualizado = await confirmarCpf(cpf);
      setPerfil(atualizado);
      setCpf('');
      setAviso('CPF confirmado com sucesso e bloqueado para alterações.');
    } catch (error) {
      setAviso(error instanceof Error ? error.message : 'Não foi possível confirmar o CPF.');
    }
  }

  async function sairDaConta() {
    await sair();
    router.replace('/entrar');
  }

  return (
    <ScrollView contentContainerStyle={styles.tela}>
      <View style={styles.topo}>
        <View><Text style={styles.titulo}>Conta de investimento</Text><Text style={styles.subtitulo}>Dados e segurança da conta</Text></View>
        <Pressable onPress={() => router.replace('/')}><Text style={styles.voltar}>Cotações</Text></Pressable>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.secaoEscura}>Dados do perfil</Text>
        {editando ? (
          <>
            <TextInput placeholderTextColor="#000000" style={styles.input} placeholder="Nome" value={form.nome ?? ''} onChangeText={(valor) => alterar('nome', valor)} />
            <TextInput placeholderTextColor="#000000" style={styles.input} placeholder="Sobrenome" value={form.sobrenome ?? ''} onChangeText={(valor) => alterar('sobrenome', valor)} />
            <TextInput autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#000000" style={styles.input} placeholder="E-mail" value={form.email ?? ''} onChangeText={(valor) => alterar('email', valor)} />
            <TextInput keyboardType="phone-pad" placeholderTextColor="#000000" style={styles.input} placeholder="Telefone (11) 99999-9999" value={form.telefone ?? ''} onChangeText={(valor) => alterar('telefone', formatarTelefone(valor))} />
            <TextInput keyboardType="numeric" placeholderTextColor="#000000" style={styles.input} placeholder="Data de nascimento (DD/MM/AAAA)" value={form.dataNascimento ?? ''} onChangeText={(valor) => alterar('dataNascimento', formatarDataNascimento(valor))} />
            <TextInput placeholderTextColor="#000000" style={styles.input} placeholder="Endereço completo" value={form.endereco ?? ''} onChangeText={(valor) => alterar('endereco', valor)} />
            <Pressable onPress={salvarPerfil} style={styles.botao}><Text style={styles.botaoTexto}>Salvar dados</Text></Pressable>
          </>
        ) : (
          <>
            <Text style={styles.nome}>{form.nome} {form.sobrenome}</Text>
            <Text style={styles.detalhe}>{form.email}</Text>
            <Text style={styles.detalhe}>{form.telefone || 'Telefone não informado'}</Text>
            <Text style={styles.detalhe}>{form.dataNascimento || 'Data de nascimento não informada'}</Text>
            <Text style={styles.detalhe}>{form.endereco || 'Endereço não informado'}</Text>
            <Pressable onPress={() => setEditando(true)}><Text style={styles.editar}>Editar dados do perfil</Text></Pressable>
          </>
        )}
      </View>

      <View style={styles.cartao}>
        <Text style={styles.secaoEscura}>Identidade e segurança</Text>
        {perfil?.cpfConfirmado ? (
          <>
            <Text style={styles.confirmado}>CPF confirmado</Text>
            <Text style={styles.detalhe}>CPF: ***.***.***-{perfil.cpf?.slice(-2)}</Text>
            <Text style={styles.nota}>O CPF confirmado não pode ser alterado.</Text>
          </>
        ) : (
          <>
            <Text style={styles.nota}>Confirme seu CPF para liberar todos os recursos da conta de investimento.</Text>
            <TextInput keyboardType="numeric" placeholderTextColor="#000000" style={styles.input} placeholder="CPF (somente números)" value={cpf ?? ''} onChangeText={setCpf} />
            <Pressable onPress={confirmar} style={styles.botao}><Text style={styles.botaoTexto}>Confirmar CPF</Text></Pressable>
          </>
        )}
      </View>

      <Text style={styles.secao}>Resumo da conta</Text>
      <View style={styles.resumo}>
        <Text style={styles.rotulo}>Patrimônio estimado</Text><Text style={styles.destaque}>{dinheiro(resumo?.patrimonio ?? 0)}</Text>
        <Text style={styles.rotulo}>Saldo disponível: <Text style={styles.numero}>{dinheiro(resumo?.saldo ?? 0)}</Text></Text>
        <Text style={styles.rotulo}>Total investido: <Text style={styles.numero}>{dinheiro(resumo?.investido ?? 0)}</Text></Text>
      </View>
      <Pressable onPress={() => router.push('/carteira')} style={styles.link}><Text style={styles.linkTexto}>Abrir minha carteira</Text></Pressable>
      <Pressable onPress={() => router.push('/favoritos')} style={styles.link}><Text style={styles.linkTexto}>Ver meus favoritos</Text></Pressable>
      {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}
      <Pressable onPress={sairDaConta} style={styles.sair}><Text style={styles.sairTexto}>Sair da conta</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { backgroundColor: cores.fundo, flexGrow: 1, padding: 24 },
  topo: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 },
  titulo: { color: cores.branco, fontSize: 26, fontWeight: '700' },
  subtitulo: { color: cores.textoClaro, marginTop: 4 },
  voltar: { color: cores.textoClaro, fontWeight: '700', marginTop: 6 },
  cartao: { backgroundColor: cores.branco, borderRadius: 16, marginTop: 18, padding: 20 },
  secaoEscura: { color: cores.texto, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  nome: { color: cores.texto, fontSize: 20, fontWeight: '700' },
  detalhe: { color: cores.textoFraco, marginTop: 7 },
  input: { backgroundColor: cores.campo, borderRadius: 10, color: cores.texto, marginBottom: 10, padding: 12 },
  botao: { backgroundColor: cores.fundo, borderRadius: 10, padding: 13 },
  botaoTexto: { color: cores.branco, fontWeight: '700', textAlign: 'center' },
  editar: { color: cores.fundo, fontWeight: '700', marginTop: 16 },
  confirmado: { color: '#147d4a', fontWeight: '700' },
  nota: { color: cores.textoFraco, fontSize: 13, marginBottom: 12, marginTop: 8 },
  secao: { color: cores.branco, fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 24 },
  resumo: { backgroundColor: cores.branco, borderRadius: 16, padding: 18 },
  rotulo: { color: cores.textoFraco, marginTop: 10 },
  destaque: { color: cores.fundo, fontSize: 26, fontWeight: '700', marginTop: 5 },
  numero: { color: cores.texto, fontWeight: '700' },
  link: { marginTop: 20 },
  linkTexto: { color: cores.textoClaro, fontSize: 16, fontWeight: '700' },
  aviso: { color: cores.textoClaro, marginTop: 16 },
  sair: { borderColor: cores.textoClaro, borderRadius: 12, borderWidth: 1, marginTop: 24, padding: 15 },
  sairTexto: { color: cores.branco, textAlign: 'center' },
});
