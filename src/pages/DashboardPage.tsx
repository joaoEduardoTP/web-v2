
import { useAuthStore } from '@/store/authStore';
import { screens } from '@/utils/screens';
import { Link } from '@tanstack/react-router';

export function DashboardPage() {
  const credentials = useAuthStore(state => state.user);


  if (!credentials) {
    return null;
  }

  const { user, permissions } = credentials;

  // const {  } = user;

  const documentModule = credentials.permissions.filter(permission => permission.module_name === 'Documentos');

  // const documentModule = modules.find(module => module.name === 'tp-documentos');

  // const { screens: documentScreens } = documentModule as Module;

  // const formattedScreens = documentScreens.map((screen) => {
  //   const path = `/${ screen.name.split('-')[0] }`;
  //   return {
  //     path,
  //   };
  // });


  return (
    user && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Bem-vindo, { user.nome }!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {
            screens.filter((screen) => formattedScreens.some(formattedScreen => formattedScreen.path === screen.path)).map((screen) => (
              <Link
                to={ screen.path }
                key={ screen.path }
                className="bg-card text-secondary-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <screen.icon className="h-6 w-6 text-zinc-900" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-foreground">{ screen.title }</h2>
                    <p className="text-sm text-muted-foreground">{ screen.title }</p>
                  </div>
                </div>
              </Link>
            ))

          } */}

          {
            screens.filter((screen) => documentModule.some(permission => permission.screen_name === screen.title.split(' ')[0] )).map((screen) => (

              <Link
                to={ screen.path }
                key={ screen.path }
                className="bg-card text-secondary-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <screen.icon className="h-6 w-6 text-zinc-900" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-foreground">{ screen.title }</h2>
                    <p className="text-sm text-muted-foreground">{ screen.title }</p>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div >
    )
  );
}

// {
//   user?.permissions.users.view && (
//     <Link
//       to="/users"
//       className="bg-card text-secondary-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
//     >
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-blue-100 rounded-lg">
//           <Users className="h-6 w-6 text-blue-600" />
//         </div>
//         <div className="text-left">
//           <h2 className="text-lg font-semibold text-foreground">Usuários</h2>
//           <p className="text-sm text-muted-foreground">Gerenciar usuários e permissões</p>
//         </div>
//       </div>
//     </Link>
//   );
// }