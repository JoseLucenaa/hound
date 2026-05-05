import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function App() {
  const [mensagem, setMensagem] = useState('');
  const [historico, setHistorico] = useState([
    { papel: 'hound', texto: 'Olá. Como posso ajudar você hoje?' }
  ]);
  const [carregando, setCarregando] = useState(false);

  // O "useRef" é a ferramenta que nos permite controlar o campo de texto
  const inputRef = useRef(null);

  // COLE SUA CHAVE NOVA DA GROQ AQUI (CUIDADO PARA NÃO VAZAR)
  const GROQ_API_KEY = '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'; 

  const perguntarAoHound = async () => {
    if (!mensagem.trim() || carregando) return;

    const novaMensagemUsuario = { papel: 'user', texto: mensagem };
    setHistorico(prev => [...prev, novaMensagemUsuario]);
    setMensagem('');
    setCarregando(true);

    // Foca no campo de texto novamente assim que a mensagem é enviada
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    try {
      const url = 'https://api.groq.com/openai/v1/chat/completions';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}` 
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          max_tokens: 1024,
          temperature: 0.7,
          messages: [
            { role: "system", content: "Você é o Hound, um assistente virtual prático. Responda de forma direta usando formatação em Markdown (negrito, listas). IMPORTANTE: Nunca use tags HTML como <br>. Se precisar listar itens, faça fora de tabelas usando bullet points normais." },
            { role: "user", content: novaMensagemUsuario.texto }
          ]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
         console.error("Detalhes do erro:", data);
         throw new Error(`Erro na API: ${response.status}`);
      }
      
      const textoResposta = data.choices[0].message.content;
      const respostaIA = { papel: 'hound', texto: textoResposta };
      
      setHistorico(prev => [...prev, respostaIA]);
    } catch (error) {
      console.error("Erro completo:", error);
      setHistorico(prev => [...prev, { papel: 'hound', texto: 'Ops! O servidor tropeçou. Tente novamente.' }]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HOUND</Text>
      </View>

      <ScrollView style={styles.chatArea}>
        {historico.map((msg, index) => (
          <View key={index} style={[styles.balao, msg.papel === 'user' ? styles.user : styles.hound]}>
            {msg.papel === 'user' ? (
              <Text style={styles.msgText}>{msg.texto}</Text>
            ) : (
              <Markdown style={markdownStyles}>
                {msg.texto}
              </Markdown>
            )}
          </View>
        ))}
        {carregando && (
          <View style={[styles.balao, styles.hound]}>
            <ActivityIndicator size="small" color="#F2C14E" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          ref={inputRef} // Conectamos a referência aqui!
          blurOnSubmit={false} // Evita que o teclado feche ao apertar "Enviar" no teclado
          style={styles.input}
          placeholder="Fale com o Hound..."
          placeholderTextColor="#A98467"
          value={mensagem}
          onChangeText={setMensagem}
          onSubmitEditing={perguntarAoHound}
        />
        <TouchableOpacity style={styles.botao} onPress={perguntarAoHound}>
          <Text style={styles.textoBotao}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ESTILOS "SOL NASCENTE" (SEM BRILHOS EXAGERADOS)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2E1F1A' }, // Marrom escuro (Fundo)
  header: { 
    paddingTop: 60, 
    paddingBottom: 20, 
    alignItems: 'center', 
    backgroundColor: '#4A332A', // Marrom médio
    borderBottomWidth: 1, 
    borderColor: '#634433' 
  },
  title: { color: '#F2C14E', fontSize: 22, fontWeight: 'bold', letterSpacing: 2 }, // Amarelo sol
  chatArea: { flex: 1, padding: 15 },
  balao: { padding: 16, borderRadius: 12, marginBottom: 15, maxWidth: '85%' },
  user: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#F2C14E', // Balão do usuário amarelo quente
    borderBottomRightRadius: 0 
  },
  hound: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#4A332A', // Balão da IA marrom 
    borderBottomLeftRadius: 0 
  },
  msgText: { color: '#2E1F1A', fontSize: 16, lineHeight: 22, fontWeight: '500' }, // Texto do usuário escuro (para contrastar com o balão amarelo)
  inputArea: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: '#4A332A', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#634433'
  },
  input: { 
    flex: 1, 
    backgroundColor: '#2E1F1A', 
    color: '#F9E4B7', // Amarelo bem claro para o texto digitado
    padding: 15, 
    borderRadius: 25, 
    marginRight: 10 
  },
  botao: { backgroundColor: '#F2C14E', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25 },
  textoBotao: { color: '#2E1F1A', fontWeight: 'bold' } // Texto do botão escuro
});

// ESTILOS ESPECÍFICOS PARA O MARKDOWN DA IA
const markdownStyles = StyleSheet.create({
  body: { color: '#F9E4B7', fontSize: 16, lineHeight: 22 }, // Texto da IA em tom areia/amarelo clarinho
  heading1: { fontSize: 22, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#F2A65A' }, // Laranja suave
  heading2: { fontSize: 20, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#F2A65A' },
  strong: { fontWeight: 'bold', color: '#F2C14E' }, // Negritos em amarelo
  em: { fontStyle: 'italic', color: '#E0C097' },
  link: { color: '#F2A65A', textDecorationLine: 'underline' },
  bullet_list: { marginTop: 5, marginBottom: 5 },
  ordered_list: { marginTop: 5, marginBottom: 5 },
  fence: { backgroundColor: '#2E1F1A', padding: 10, borderRadius: 5, color: '#F9E4B7', fontFamily: 'monospace' }, 
  code_inline: { backgroundColor: '#2E1F1A', padding: 3, borderRadius: 3, color: '#F2C14E', fontFamily: 'monospace' },
  table: { borderWidth: 1, borderColor: '#634433', borderRadius: 5 },
  tr: { borderBottomWidth: 1, borderColor: '#634433', flexDirection: 'row' },
  th: { padding: 5, fontWeight: 'bold', color: '#F2C14E', flex: 1, backgroundColor: '#2E1F1A' },
  td: { padding: 5, color: '#F9E4B7', flex: 1 }
});