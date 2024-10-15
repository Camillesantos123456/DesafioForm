import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [termos, setTermos] = useState(false);
  const [idade, setIdade] = useState<number | null>(null);
  const [showPDF, setShowPDF] = useState(false);

  const validarFormulario = () => {
    if (!nome || !email || !endereco || !dataNascimento || !telefone || !termos) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return false;
    }
    calcularIdade(dataNascimento);
    return true;
  };

  const calcularIdade = (dataNasc: string) => {
    const [dia, mes, ano] = dataNasc.split('/');
    const nascimento = new Date(`${ano}-${mes}-${dia}`); 
    const hoje = new Date();

    if (nascimento.toString() === 'Invalid Date') {
      Alert.alert('Erro', 'Data de nascimento inválida!');
      return;
    }

    let idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
    const mesNascimento = nascimento.getMonth();
    const mesAtual = hoje.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idadeCalculada -= 1;
    }

    setIdade(idadeCalculada);
  };


  const handleDataChange = (text: string) => {
    const numeros = text.replace(/\D/g, '');
    
    let dataFormatada = '';

    if (numeros.length > 0) {
      dataFormatada += numeros.substring(0, 2); 
      if (numeros.length >= 3) {
        dataFormatada += '/' + numeros.substring(2, 4); 
      }
      if (numeros.length >= 5) {
        dataFormatada += '/' + numeros.substring(4, 8); 
      }
    }

    setDataNascimento(dataFormatada);
  };


  const handleTelefoneChange = (text: string) => {
    const numeros = text.replace(/\D/g, ''); 

    let telefoneFormatado = '';

    if (numeros.length > 0) {
      telefoneFormatado += '(' + numeros.substring(0, 2) + ')';
    }
    if (numeros.length > 2) {
      telefoneFormatado += numeros.substring(2, 7);
    }
    if (numeros.length >= 7) {
      telefoneFormatado += '-' + numeros.substring(7, 11);
    }

    setTelefone(telefoneFormatado);
  };

  const handleSubmit = () => {
    if (validarFormulario()) {
      setShowPDF(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dados do participante</Text>
      <View style={styles.form}>
        <Text>Nome:</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite seu nome" />

        <Text>E-mail:</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="exemplo@exemplo.com" keyboardType="email-address" />

        <Text>Endereço:</Text>
        <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua Trinta e Três, 245 - Bairro" />

        <Text>Data de Nascimento:</Text>
        <TextInput
          style={styles.input}
          value={dataNascimento}
          onChangeText={handleDataChange}
          placeholder="dd/mm/aaaa"
          keyboardType="numeric"
        />

        <Text>Telefone:</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={handleTelefoneChange}
          placeholder="(99) 99999-9999"
          keyboardType="numeric"
        />

        <View style={styles.termosContainer}>
          <TouchableOpacity onPress={() => setTermos(!termos)} style={[styles.checkbox, termos && styles.checked]}>
            {termos && <Text style={styles.checkmark}>✔</Text>}
          </TouchableOpacity>
          <Text style={styles.termosText}>Aceito os termos</Text>
        </View>

        <Button title="Gerar PDF" onPress={handleSubmit} />
      </View>

      {showPDF && idade !== null && (
        <View style={styles.pdf}>
          <Text>____________________________________________________________________________</Text>
          <Text>DECLARAÇÃO</Text>
          <Text>Eu me chamo {nome},</Text>
          <Text>tenho {idade} anos.</Text>
          <Text>Moro no seguinte endereço: {endereco}.</Text>
          <Text>Meus contatos:</Text>
          <Text>- E-mail: {email}</Text>
          <Text>- Telefone: {telefone}</Text>
          <Text>____________________________________________________________________________</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  termosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#E0B0FF',
    borderColor: '#A020F0', // Cor da borda
  },
  checkmark: {
    color: '#000',
    fontSize: 18,
  },
  termosText: {
    fontSize: 16,
  },
  pdf: {
    marginTop: 20,
    padding: 20,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
});
