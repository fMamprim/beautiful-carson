import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Utensils, Tag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3333/api' });

// --- Componente Modal Genérico ---
function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">ComandasWeb</h1>
          </div>
          <nav className="p-4 space-y-2">
            <Link to="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Caixa / Mesas
            </Link>
            <Link to="/products" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Utensils className="w-5 h-5 mr-3" />
              Produtos
            </Link>
            <Link to="/categories" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Tag className="w-5 h-5 mr-3" />
              Categorias
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Dashboard() {
  const [tables, setTables] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const { data } = await api.get('/tables');
      setTables(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addTable = async (e: any) => {
    e.preventDefault();
    if (!tableNumber) return;
    try {
      await api.post('/tables', { number: tableNumber });
      setTableNumber('');
      setIsModalOpen(false);
      fetchTables();
    } catch(e) {
      alert('Erro ao criar mesa. Ela pode já existir.');
    }
  };

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Visão Geral (Caixa)</h2>
          <p className="text-gray-500">Acompanhe as comandas em tempo real.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition">
          + Nova Mesa
        </button>
      </header>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Nova Mesa">
        <form onSubmit={addTable} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número da Mesa</label>
            <input 
              type="number" 
              value={tableNumber} 
              onChange={e => setTableNumber(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Ex: 12"
              autoFocus
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
            Salvar Mesa
          </button>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.length === 0 && <p className="text-gray-500">Nenhuma mesa cadastrada ainda.</p>}
        {tables.map(table => (
          <div 
            key={table.id} 
            className={`p-6 rounded-xl border ${table.status === 'OCCUPIED' ? 'bg-white border-blue-500 shadow-sm' : 'bg-gray-100 border-gray-200 border-dashed'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Mesa {table.number}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${table.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                {table.status === 'OCCUPIED' ? 'Ocupada' : 'Livre'}
              </span>
            </div>
            {table.status === 'OCCUPIED' && (
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition font-medium">
                Ver Comanda
              </button>
            )}
            {table.status === 'FREE' && (
              <button className="w-full py-2 bg-white border border-gray-300 text-gray-600 rounded-lg transition font-medium cursor-default">
                Aguardando Cliente
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data);
  };

  const addCategory = async (e: any) => {
    e.preventDefault();
    if (!name) return;
    await api.post('/categories', { name });
    setName('');
    setIsModalOpen(false);
    fetchCategories();
  };

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Categorias</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm">
          + Nova Categoria
        </button>
      </header>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Categoria">
        <form onSubmit={addCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Ex: Bebidas, Lanches..."
              autoFocus
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
            Salvar Categoria
          </button>
        </form>
      </Modal>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {categories.length === 0 && <p className="p-4 text-gray-500">Nenhuma categoria cadastrada.</p>}
        {categories.map(c => (
          <div key={c.id} className="p-4 border-b border-gray-200 text-gray-800 font-medium">
            {c.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => { 
    fetchProducts();
    api.get('/categories').then(res => {
      setCategories(res.data);
      if(res.data.length > 0) setCategoryId(res.data[0].id);
    });
  }, []);

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  };

  const addProduct = async (e: any) => {
    e.preventDefault();
    if (!name || !price || !categoryId) return;

    await api.post('/products', { 
      name, 
      price: parseFloat(price.replace(',', '.')), 
      categoryId, 
      description: '' 
    });

    setName('');
    setPrice('');
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm">
          + Novo Produto
        </button>
      </header>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Produto">
        <form onSubmit={addProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: X-Bacon" required autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 25.50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" required>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition mt-2">
            Salvar Produto
          </button>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 && <p className="text-gray-500 col-span-3">Nenhum produto cadastrado.</p>}
        {products.map(p => (
          <div key={p.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-800">{p.name}</h3>
            <p className="text-lg text-blue-600 font-bold mt-1">R$ {p.price.toFixed(2)}</p>
            <span className="inline-block mt-3 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              {p.category?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
