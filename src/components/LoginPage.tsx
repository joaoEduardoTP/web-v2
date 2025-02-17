import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { PackageSearch } from 'lucide-react';
// import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const { login } = useAuth();
  // const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === 'admin' && password === 'password') { // Simulação de login - substitua pela sua lógica real
      login(username);
      setError('');
      // Redirecione para a página principal ou outra página protegida aqui
      // console.log('Login bem-sucedido!');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <PackageSearch className="mx-auto h-12 w-12 text-foreground" />
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Sistema de Controle de Envelopes
          </h2>
          <p className="mt-2 text-sm text-secondary-foreground">
            Faça login para acessar o sistema
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={ handleSubmit }>
          { error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              { error }
            </div>
          ) }

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={ username }
                onChange={ (e) => setUsername(e.target.value) }
                className="mt-1 block w-full px-3 py-2 border-input  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}