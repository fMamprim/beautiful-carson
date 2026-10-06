import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Utensils, Tag } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">ComandasWeb</h1>
          </div>
          <nav className="p-4 space-y-2">
            <Link to="/" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Caixa / Mesas
            </Link>
            <Link to="/products" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Utensils className="w-5 h-5 mr-3" />
              Produtos
            </Link>
            <Link to="/categories" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Tag className="w-5 h-5 mr-3" />
              Categorias
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<div>Produtos (Em construção)</div>} />
            <Route path="/categories" element={<div>Categorias (Em construção)</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Dashboard() {
  // Mock tables
  const tables = [
    { id: 1, number: 1, status: 'FREE' },
    { id: 2, number: 2, status: 'OCCUPIED' },
    { id: 3, number: 3, status: 'FREE' },
    { id: 4, number: 4, status: 'OCCUPIED' },
  ];

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Visão Geral (Caixa)</h2>
        <p className="text-gray-500">Acompanhe as comandas em tempo real.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map(table => (
          <div 
            key={table.id} 
            className={`p-6 rounded-xl border ${table.status === 'OCCUPIED' ? 'bg-white border-primary shadow-sm' : 'bg-gray-100 border-gray-200 border-dashed'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Mesa {table.number}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${table.status === 'OCCUPIED' ? 'bg-blue-100 text-primary' : 'bg-gray-200 text-gray-600'}`}>
                {table.status === 'OCCUPIED' ? 'Ocupada' : 'Livre'}
              </span>
            </div>
            {table.status === 'OCCUPIED' && (
              <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition font-medium">
                Ver Comanda
              </button>
            )}
            {table.status === 'FREE' && (
              <button className="w-full py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">
                Abrir Comanda
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
