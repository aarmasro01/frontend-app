import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { tabsHomeGuard } from '../guards/tabs-home.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      // Redirección inicial condicionada por rol (solo cuando entras a /tabs raíz)
      {
        path: '',
        canActivate: [tabsHomeGuard],
        // Este componente no se renderiza, el guard siempre devuelve UrlTree
        loadComponent: () =>
          import('../menu/menu.page').then(m => m.MenuPage),
      },

      {
        path: 'menu',
        loadComponent: () =>
          import('../menu/menu.page').then((m) => m.MenuPage),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'perfilUsuario',
        loadComponent: () =>
          import('../perfil-usuario/perfil-usuario.page').then((m) => m.PerfilUsuarioPage),
      },
      {
        path: 'reclamaciones',
        loadComponent: () =>
          import('../reclamaciones/reclamaciones.page').then((m) => m.ReclamacionesPage),
      },
      {
        path: 'buscar',
        loadComponent: () =>
          import('../buscar/buscar.page').then((m) => m.BuscarPage),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('../usuarios/usuarios.page').then(m => m.UsuariosPage)
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('../productos/productos.page').then(m => m.ProductosPage)
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('../pedidos/pedidos.page').then(m => m.PedidosPage)
      },
      {
        path: 'detalle-pedido',
        loadComponent: () =>
          import('../detalle-pedido/detalle-pedido.page').then(m => m.DetallePedidoPage)
      },
      {
        path: 'zonas',
        loadComponent: () =>
          import('../zonas/zonas.page').then(m => m.ZonasPage)
      },
      {
        path: 'pagos',
        loadComponent: () =>
          import('../pagos/pagos.page').then(m => m.PagosPage)
      },
      {
        path: 'reclamos',
        loadComponent: () =>
          import('../reclamos/reclamos.page').then(m => m.ReclamosPage)
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('../historial/historial.page').then(m => m.HistorialPage)
      },
      {
        path: 'seguimiento-pedido',
        loadComponent: () =>
          import('../seguimiento-pedido/seguimiento-pedido.page').then(m => m.SeguimientoPedidoPage)
      },
      {
        path: 'pedidos-repartidor',
        loadComponent: () => import('../pedidos-repartidor/pedidos-repartidor.page').then( m => m.PedidosRepartidorPage)
      },
      {
        path: 'panel',
        loadComponent: () =>
          import('../panel/panel.page').then(m => m.PanelPage)
      },
    ],
  },

  // Fallback global
  {
    path: '',
    redirectTo: '/tabs/menu',
    pathMatch: 'full',
  },
];
