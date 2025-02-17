import React, { useState } from 'react';
import { Users, UserPlus, Edit, Trash2, Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/localStorage';
import type { User, UserRole, Permission } from '../types';

export function UsersPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers
  });

  const createUserMutation = useMutation({
    mutationFn: userService.saveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditing(false);
      setEditingUser(null);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.username || !editingUser?.password || !editingUser?.name) return;

    const newUser: User = {
      id: editingUser.id || crypto.randomUUID(),
      username: editingUser.username,
      password: editingUser.password,
      name: editingUser.name,
      role: editingUser.role || 'user',
      active: editingUser.active ?? true,
      permissions: editingUser.permissions || {
        envelopes: { view: true, create: false, edit: false, delete: false },
        users: { view: false, create: false, edit: false, delete: false }
      }
    };

    createUserMutation.mutate(newUser);
  };

  return (
    <div className="max-w-[92vw] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6" />
          Gerenciamento de Usuários
        </h1>
        { !editingUser && (
          <button
            onClick={ handleNewUser }
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Novo Usuário
          </button>
        ) }
      </div>

      { editingUser && (
        <form onSubmit={ handleSubmit } className="bg-card text-secondary-foreground p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={ editingUser.name || '' }
                onChange={ (e) => setEditingUser({ ...editingUser, name: e.target.value }) }
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Usuário</label>
              <input
                type="text"
                value={ editingUser.username || '' }
                onChange={ (e) => setEditingUser({ ...editingUser, username: e.target.value }) }
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={ editingUser.password || '' }
                onChange={ (e) => setEditingUser({ ...editingUser, password: e.target.value }) }
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Função</label>
              <select
                value={ editingUser.role || 'user' }
                onChange={ (e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole }) }
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ editingUser.active }
                  onChange={ (e) => setEditingUser({ ...editingUser, active: e.target.checked }) }
                  className="h-4 w-4 text-blue-600 rounded border-input"
                />
                <span className="text-sm text-secondary-foreground">Usuário ativo</span>
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="text-lg font-medium text-foreground mb-4">Permissões</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Envelopes</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ editingUser.permissions?.envelopes.view }
                        onChange={ (e) => handlePermissionChange('envelopes', 'view', e.target.checked) }
                        className="h-4 w-4 text-blue-600 rounded border-input"
                      />
                      <span className="text-sm text-secondary-foreground">Visualizar</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ editingUser.permissions?.envelopes.create }
                        onChange={ (e) => handlePermissionChange('envelopes', 'create', e.target.checked) }
                        className="h-4 w-4 text-blue-600 rounded border-input"
                      />
                      <span className="text-sm text-secondary-foreground">Criar</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ editingUser.permissions?.envelopes.edit }
                        onChange={ (e) => handlePermissionChange('envelopes', 'edit', e.target.checked) }
                        className="h-4 w-4 text-blue-600 rounded border-input"
                      />
                      <span className="text-sm text-secondary-foreground">Editar</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ editingUser.permissions?.envelopes.delete }
                        onChange={ (e) => handlePermissionChange('envelopes', 'delete', e.target.checked) }
                        className="h-4 w-4 text-blue-600 rounded border-input"
                      />
                      <span className="text-sm text-secondary-foreground">Excluir</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Usuários</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ editingUser.permissions?.users.view }
                        onChange={ (e) => handlePermissionChange('users', 'view', e.target.checked) }
                        className="h-4 w-4 text-blue-600 rounded border-input"
                      />
                      <span className="text-sm text-secondary-foreground">Visualizar</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ editingUser.permissions?.users.create }
                        onChange={ (e) => handlePermissionChange('users', 'create', e.target.checked) }
                        className="h-4 w-4 text-blue-600 rounded border-input"
                      />
                      <span className="text-sm text-secondary-foreground">Criar</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ editingUser.permissions?.users.edit }
                        onChange={ (e) => handlePermissionChange('users', 'edit', e.target.checked) }
                        className="h-4 w-4 text-blue-600 rounded border-input"
                      />
                      <span className="text-sm text-secondary-foreground">Editar</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ editingUser.permissions?.users.delete }
                        onChange={ (e) => handlePermissionChange('users', 'delete', e.target.checked) }
                        className="h-4 w-4 text-blue-600 rounded border-input"
                      />
                      <span className="text-sm text-secondary-foreground">Excluir</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={ handleCancel }
              className="inline-flex items-center px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-accent"
            >
              <X className="h-5 w-5 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-5 w-5 mr-2" />
              { isEditing ? 'Salvar' : 'Criar' }
            </button>
          </div>
        </form>
      ) }

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            { users.map((user) => (
              <tr key={ user.id }>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{ user.name }</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-muted-foreground">{ user.username }</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-muted-foreground">
                    { user.role === 'admin' ? 'Administrador' : 'Usuário' }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={ `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ user.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }` }>
                    { user.active ? 'Ativo' : 'Inativo' }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={ () => handleEdit(user) }
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    { user.username !== 'Admin' && (
                      <button
                        onClick={ () => handleDelete(user) }
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    ) }
                  </div>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );
}
