import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation simple
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur de connexion';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">MAKONON</h1>
          <p className="text-gray-500 text-sm mt-1">TRANSFERT D'ARGENT</p>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-3 rounded-full"></div>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 text-center mb-6">
          Connexion à votre compte
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Adresse email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@makonon.com"
              required
              disabled={isLoading || isLoggingIn}
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading || isLoggingIn}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2.5"
            isLoading={isLoading || isLoggingIn}
            disabled={isLoading || isLoggingIn}
          >
            Se connecter
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400 border-t pt-4">
          <p>MAKONON TRANSFERT v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
