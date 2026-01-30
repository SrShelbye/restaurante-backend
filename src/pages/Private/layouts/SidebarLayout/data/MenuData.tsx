import { MenuSection } from '../../interfaces';

import {
  AssignmentOutlined,
  FiberManualRecord,
  ListAltOutlined,
  MenuBookOutlined,
  SoupKitchenOutlined,
  Storefront,
  InventoryOutlined,
  RestaurantMenuOutlined,
  ShoppingCartOutlined,
  PointOfSaleOutlined,
  AssessmentOutlined,
  PeopleOutline
} from '@mui/icons-material';

import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import KitchenOutlinedIcon from '@mui/icons-material/KitchenOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

import { ValidRoles } from '../../../Common/models/valid-roles.model';

const inventorySection = {
  title: 'Inventario',
  allowedRoles: [ValidRoles.admin],
  items: [
    {
      title: 'Ingredientes',
      icon: <Inventory2OutlinedIcon fontSize='small' />,
      to: '/inventory/ingredients'
    },
    {
      title: 'Semielaborados',
      icon: <KitchenOutlinedIcon fontSize='small' />,
      to: '/inventory/semifinished'
    },
    {
      title: 'Reporte de Stock',
      icon: <AssessmentOutlined fontSize='small' />,
      to: '/inventory/stock-report'
    }
  ]
};

const recipesSection = {
  title: 'Recetas',
  allowedRoles: [ValidRoles.admin],
  items: [
    {
      title: 'Gestión de Recetas',
      icon: <RestaurantMenuOutlined fontSize='small' />,
      to: '/recipes'
    },
    {
      title: 'Análisis de Costos',
      icon: <TrendingUpOutlinedIcon fontSize='small' />,
      to: '/recipes/cost-analysis'
    }
  ]
};

const purchasingSection = {
  title: 'Compras',
  allowedRoles: [ValidRoles.admin],
  items: [
    {
      title: 'Proveedores',
      icon: <StorefrontOutlinedIcon fontSize='small' />,
      to: '/purchasing/suppliers'
    },
    {
      title: 'Órdenes de Compra',
      icon: <ShoppingBasketOutlinedIcon fontSize='small' />,
      to: '/purchasing/purchases'
    },
    {
      title: 'Resumen de Compras',
      icon: <BarChartOutlinedIcon fontSize='small' />,
      to: '/purchasing/summary'
    }
  ]
};

const salesSection = {
  title: 'Ventas',
  items: [
    {
      title: 'Punto de Venta',
      icon: <PointOfSaleOutlined fontSize='small' />,
      to: '/sales'
    },
    {
      title: 'Reporte Diario',
      icon: <AssessmentOutlined fontSize='small' />,
      to: '/sales/daily'
    },
    {
      title: 'Cierre de Caja',
      icon: <AccountBalanceWalletOutlinedIcon fontSize='small' />,
      to: '/sales/close-cash-register'
    }
  ]
};

const reportsSection = {
  title: 'Reportes',
  allowedRoles: [ValidRoles.admin],
  items: [
    {
      title: 'Dashboard Principal',
      icon: <DashboardOutlinedIcon fontSize='small' />,
      to: '/reports/dashboard'
    },
    {
      title: 'Valuación de Inventario',
      icon: <InventoryOutlined fontSize='small' />,
      to: '/reports/inventory-valuation'
    },
    {
      title: 'Rentabilidad',
      icon: <TrendingUpOutlinedIcon fontSize='small' />,
      to: '/reports/profitability'
    },
    {
      title: 'Uso de Ingredientes',
      icon: <KitchenOutlinedIcon fontSize='small' />,
      to: '/reports/ingredient-usage'
    }
  ]
};

/* */
const ordersSection = {
  title: 'Pedidos',
  items: [
    {
      title: 'Pedidos',
      icon: <AssignmentOutlined fontSize='small' />,
      to: '/orders/'
    },
    {
      title: 'Preparación de pedidos',
      icon: <SoupKitchenOutlined fontSize='small' />,
      to: '/orders/actives'
      // allowedRoles: [ValidRoles.mesero],
    },
    {
      title: 'Lista de pedidos',
      icon: <ListAltOutlined fontSize='small' />,
      to: '/orders/list'
    }
    // {
    //   title: 'Cuentas',
    //   icon: <ReceiptLongOutlined fontSize='small' />,
    //   to: '/bills'
    // }
  ]
};

const managementSection = {
  title: 'Administración',
  allowedRoles: [ValidRoles.admin],
  items: [
    {
      title: 'Menú del restaurante',
      icon: <MenuBookOutlined fontSize='small' />,
      to: '/menu/sections',
      subItems: [
        {
          title: 'Secciones',
          to: '/menu/sections',
          icon: <FiberManualRecord sx={{ fontSize: 8 }} />
        },
        {
          title: 'Categorías',
          to: '/menu/categories',
          icon: <FiberManualRecord sx={{ fontSize: 8 }} />
          // allowedRoles: [ValidRoles.mesero],
        },
        {
          title: 'Productos',
          to: '/menu/products',
          icon: <FiberManualRecord sx={{ fontSize: 8 }} />
        }
      ]
    },
    {
      title: 'Gestión de mesas',
      icon: <TableRestaurantOutlinedIcon fontSize='small' />,
      to: '/tables'
    },
    {
      title: 'Gestión de usuarios',
      icon: <PeopleOutline fontSize='small' />,
      to: '/users'
    }
    // {
    //   title: 'Gestión de clientes',
    //   icon: <Groups3OutlinedIcon />,
    //   to: '/clients'
    // }
  ]
};

const generalSection: MenuSection = {
  title: '',
  allowedRoles: [ValidRoles.admin],
  items: [
    {
      title: 'Dashboard',
      icon: <DashboardOutlinedIcon fontSize='small' />,
      to: '/reports/dashboard'
    },
    {
      title: 'Restaurante',
      icon: <Storefront fontSize='small' />,
      to: '/restaurant',
      label: 'Nuevo'
    }
  ]
};

export const menuSections: MenuSection[] = [
  generalSection,
  ordersSection,
  inventorySection,
  recipesSection,
  purchasingSection,
  salesSection,
  reportsSection,
  managementSection
];
