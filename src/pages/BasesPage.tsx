import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Building2, Plus, Edit, Trash2, MapPin, Phone, FileText } from 'lucide-react';
import { Base } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { baseService as apiBaseService } from '@/services/api';
import { Alert } from '@/components/alert';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().min(2, 'Selecione um estado'),
  contact: z.string().min(11, 'O contato deve ser 11922223333 - 11 Digitos').max(11, 'O contato deve ser 11922223333  - 11 Digitos'),
  description: z.string().optional(),
});


const STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

export function BasesPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const queryClient = useQueryClient();


  const { data: bases = [] } = useQuery({
    queryKey: ['bases'],
    queryFn: apiBaseService.getBases
  });

  const createBaseMutation = useMutation({
    mutationFn: apiBaseService.saveBase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bases'] });
      handleCancel();
    }
  });

  const deleteBaseMutation = useMutation({
    mutationFn: apiBaseService.deleteBase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bases'] });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      city: '',
      state: '',
      contact: '',
      description: '',
    },
  });



  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // const now = new Date().toISOString();


    const newBase: Base = {
      id: editingId || '',
      ...values,
      description: values.description || '',
      // createdAt: editingId ? bases.find(b => b.id === editingId)?.createdAt || now : now,
      // updatedAt: now,
    };

    createBaseMutation.mutate(newBase);
  };

  const handleDelete = (base: Base) => {
    deleteBaseMutation.mutate(base.id);
  };

  const handleEdit = (base: Base) => {
    setIsEditing(true);
    setEditingId(base.id);
    form.reset({
      name: base.name,
      city: base.city,
      state: base.state,
      contact: base.contact,
      description: base.description,
    });
  };

  const handleNewBase = () => {
    setIsEditing(true);
    setEditingId(null);
    form.reset();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          Gerenciamento de Bases
        </h1>
        { !editingId && (
          <Button onClick={ handleNewBase } className="gap-2">
            <Plus className="h-5 w-5" />
            Nova Base
          </Button>
        ) }
      </div>

      { (isEditing || editingId) && (
        <div className="bg-background p-6 rounded-lg shadow-md mb-8">
          <Form { ...form }>
            <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={ form.control }
                  name="name"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Base</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome da base" { ...field } />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

                <FormField
                  control={ form.control }
                  name="city"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a cidade" { ...field } />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

                <FormField
                  control={ form.control }
                  name="state"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={ field.onChange }
                        defaultValue={ field.value }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          { STATES.map((state) => (
                            <SelectItem key={ state.value } value={ state.value }>
                              { state.label }
                            </SelectItem>
                          )) }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

                <FormField
                  control={ form.control }
                  name="contact"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Contato</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" { ...field } />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

                <FormField
                  control={ form.control }
                  name="description"
                  render={ ({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais sobre a base..."
                          { ...field }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={ handleCancel }
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  { isEditing ? 'Salvar' : 'Criar' }
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) }

      <div className="bg-background shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Base</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            { bases.map((base) => (
              <TableRow key={ base.id } className="hover:bg-accent">
                <TableCell>
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-foreground">{ base.name }</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm text-muted-foreground">
                      { base.city } - { base.state }
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm text-muted-foreground">{ base.contact || '-' }</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      { base.description || '-' }
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={ () => handleEdit(base) }
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Alert
                      title='Voce tem certeza que deseja excluir ?'
                      desc='Esta ação não pode ser desfeita. Isso excluirá permanentemente!'
                      handleConfirm={ () => handleDelete(base) }>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </Alert>
                  </div>
                </TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </div>


    </div>
  );
}



