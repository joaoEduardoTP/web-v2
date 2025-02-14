
import { Link } from '@tanstack/react-router';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import shadcn/ui Button

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-card rounded-lg shadow-md p-8 border border-border">
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Página não encontrada
          </h1>
          <p className="text-muted-foreground mb-8">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
          <Button asChild>
            <Link to='/' className="flex items-center"> 
              <Home className="h-5 w-5 mr-2" />
              Voltar para a página inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// export function NotFoundPage() {
//   return (
//     <div>
//       <Button>
//         <Link to='/'>Inicio</Link>
//       </Button>
//     </div>
//   );
// }