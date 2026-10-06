import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';

// AVISO: Altere este IP para o IP real do computador na rede Wi-Fi (ex: 192.168.1.100)
// No emulador Android, pode-se usar 10.0.2.2 provisoriamente.
const API_URL = 'http://10.0.2.2:3333/api'; 

export default function App() {
  const [screen, setScreen] = useState('login'); // 'login' | 'tables' | 'menu'
  const [pin, setPin] = useState('');
  const [tables, setTables] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    if (screen === 'tables') {
      axios.get(`${API_URL}/tables`).then(res => setTables(res.data)).catch(e => console.log('Erro mesas', e));
    }
  }, [screen]);

  useEffect(() => {
    if (screen === 'menu') {
      axios.get(`${API_URL}/products`).then(res => setProducts(res.data)).catch(e => console.log('Erro produtos', e));
    }
  }, [screen]);

  const handleLogin = () => {
    if (pin === '1234') { 
      setScreen('tables');
    } else {
      Alert.alert('Erro', 'PIN Incorreto (use 1234 para testar)');
    }
  };

  const openTable = async (table: any) => {
    try {
      if (table.status === 'FREE') {
        await axios.post(`${API_URL}/orders/open`, { tableId: table.id });
      }
      setSelectedTable(table);
      setScreen('menu');
      setCart([]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível acessar a mesa.');
    }
  };

  const addToCart = (product: any) => {
    setCart([...cart, { ...product, uniqueId: Math.random().toString() }]);
  };

  const sendOrder = async () => {
    if (cart.length === 0) return Alert.alert('Aviso', 'Adicione itens primeiro!');
    try {
      Alert.alert('Sucesso', 'Pedido enviado para a cozinha!');
      setCart([]);
      setScreen('tables');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao enviar pedido');
    }
  };

  if (screen === 'login') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ComandasApp</Text>
        <Text style={styles.subtitle}>Digite o PIN de Acesso (Teste com 1234)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          secureTextEntry 
          value={pin} 
          onChangeText={setPin} 
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'tables') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Selecione a Mesa</Text>
        <ScrollView contentContainerStyle={styles.grid}>
          {tables.length === 0 && <Text style={{textAlign: 'center', width: '100%'}}>Nenhuma mesa encontrada ou API off.</Text>}
          {tables.map(table => (
            <TouchableOpacity 
              key={table.id} 
              style={[styles.tableCard, table.status === 'OCCUPIED' ? styles.occupied : styles.free]}
              onPress={() => openTable(table)}
            >
              <Text style={styles.tableText}>{table.number}</Text>
              <Text style={styles.tableStatus}>{table.status === 'OCCUPIED' ? 'Ocupada' : 'Livre'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (screen === 'menu') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreen('tables')}><Text style={styles.backBtn}>{'< Voltar'}</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Mesa {selectedTable?.number}</Text>
        </View>

        <ScrollView style={styles.productList}>
          {products.map(p => (
            <View key={p.id} style={styles.productCard}>
              <View>
                <Text style={styles.productName}>{p.name}</Text>
                <Text style={styles.productPrice}>R$ {p.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => addToCart(p)}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.cartBar}>
          <Text style={styles.cartText}>{cart.length} itens</Text>
          <TouchableOpacity style={styles.sendButton} onPress={sendOrder}>
            <Text style={styles.sendButtonText}>Enviar Pedido</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 15, fontSize: 24, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#2563eb', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tableCard: { width: '48%', padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', justifyContent: 'center' },
  free: { backgroundColor: '#e5e7eb' },
  occupied: { backgroundColor: '#bfdbfe', borderColor: '#3b82f6', borderWidth: 2 },
  tableText: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  tableStatus: { fontSize: 12, color: '#4b5563', marginTop: 5 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { fontSize: 16, color: '#2563eb' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 20 },
  productList: { flex: 1 },
  productCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  productPrice: { fontSize: 14, color: '#10b981', marginTop: 4, fontWeight: 'bold' },
  addButton: { backgroundColor: '#2563eb', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#fff', fontSize: 24, lineHeight: 26 },
  cartBar: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderRadius: 12 },
  cartText: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  sendButton: { backgroundColor: '#10b981', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
