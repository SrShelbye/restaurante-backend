import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Kitchen,
  LocalBar,
  OutdoorGrill,
  Restaurant,
  Refresh,
  CheckCircle,
  RadioButtonUnchecked,
  Done,
  Timer
} from '@mui/icons-material';
import { useProductionAreaOrders } from '../../hooks/useProductionAreaOrders';
import { useProductionAreasStore } from '../../../Common/store/production-areas-store';
import { TitlePage } from '../../../components/TitlePage.component';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`production-tabpanel-${index}`}
      aria-labelledby={`production-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const getProductionAreaIcon = (areaName: string) => {
  const name = areaName.toLowerCase();
  if (name.includes('cocina') || name.includes('kitchen')) return <Kitchen />;
  if (name.includes('bar') || name.includes('bebida')) return <LocalBar />;
  if (name.includes('grill') || name.includes('parrilla')) return <OutdoorGrill />;
  if (name.includes('ensalada') || name.includes('salad')) return <Restaurant />;
  return <Kitchen />;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'preparing': return 'info';
    case 'ready': return 'success';
    case 'delivered': return 'default';
    default: return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <RadioButtonUnchecked />;
    case 'preparing': return <Timer />;
    case 'ready': return <CheckCircle />;
    case 'delivered': return <Done />;
    default: return <RadioButtonUnchecked />;
  }
};

export const ProductionAreaOrders: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { productionAreas, productionAreaActive, setProductionAreaActive } = useProductionAreasStore();
  const {
    orders,
    pendingOrders,
    preparingOrders,
    readyOrders,
    isLoading,
    refetch,
    getOrdersForArea,
    selectedAreaId,
    updateOrderDetailStatus
  } = useProductionAreaOrders(productionAreaActive?.id?.toString());

  useEffect(() => {
    if (productionAreas.length > 0 && !productionAreaActive) {
      setProductionAreaActive(productionAreas[0]);
    }
  }, [productionAreas, productionAreaActive, setProductionAreaActive]);

  const handleAreaChange = (areaId: string | number) => {
    const area = productionAreas.find(a => a.id === areaId);
    if (area) {
      setProductionAreaActive(area);
      getOrdersForArea(areaId.toString());
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStatusUpdate = async (orderId: string, detailId: string, newStatus: string) => {
    await updateOrderDetailStatus(orderId, detailId, newStatus);
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' component='div'>
            Orden #{order.orderNumber}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {new Date(order.createdAt).toLocaleTimeString()}
          </Typography>
        </Box>
        
        {order.tableId && (
          <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
            Mesa: {order.tableId.number || 'N/A'}
          </Typography>
        )}

        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Cliente: {order.customerName || 'Sin nombre'}
        </Typography>

        <List dense>
          {order.details
            .filter((detail: any) => detail.productId?.productionAreaId?._id === selectedAreaId)
            .map((detail: any) => (
              <ListItem key={detail._id} sx={{ pl: 0 }}>
                <ListItemIcon>
                  {getStatusIcon(detail.status)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='body1'>
                        {detail.quantity}x {detail.productId?.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          size='small'
                          label={detail.status}
                          color={getStatusColor(detail.status) as any}
                        />
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={() => {
                            const nextStatus = detail.status === 'pending' ? 'preparing' : 
                                             detail.status === 'preparing' ? 'ready' : 'delivered';
                            handleStatusUpdate(order._id, detail._id, nextStatus);
                          }}
                        >
                          {detail.status === 'pending' ? 'Iniciar' :
                           detail.status === 'preparing' ? 'Listo' : 'Entregado'}
                        </Button>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Typography variant='body2' color='text.secondary'>
                      ${detail.totalPrice.toFixed(2)}
                      {detail.notes && ` - ${detail.notes}`}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth='xl' sx={{ mb: 4 }}>
      <TitlePage
        title='Panel de Producción'
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {productionAreas.map((area) => (
              <Button
                key={area.id}
                variant={productionAreaActive?.id === area.id ? 'contained' : 'outlined'}
                size='small'
                startIcon={getProductionAreaIcon(area.name)}
                onClick={() => handleAreaChange(area.id)}
              >
                {area.name}
              </Button>
            ))}
            <IconButton onClick={() => refetch()} disabled={isLoading}>
              <Refresh />
            </IconButton>
          </Box>
        }
      />

      {productionAreaActive && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {getProductionAreaIcon(productionAreaActive.name)}
          <Typography variant='h6'>
            {productionAreaActive.name}
          </Typography>
        </Box>
      )}

      {selectedAreaId && (
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label='production tabs'
            variant='scrollable'
            scrollButtons='auto'
          >
            <Tab
              label={
                <Badge badgeContent={pendingOrders.length} color='error'>
                  Pendientes
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={preparingOrders.length} color='warning'>
                  Preparando
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={readyOrders.length} color='success'>
                  Listos
                </Badge>
              }
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              {pendingOrders.map((order) => (
                <Grid item xs={12} md={6} lg={4} key={order._id}>
                  <OrderCard order={order} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {preparingOrders.map((order) => (
                <Grid item xs={12} md={6} lg={4} key={order._id}>
                  <OrderCard order={order} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              {readyOrders.map((order) => (
                <Grid item xs={12} md={6} lg={4} key={order._id}>
                  <OrderCard order={order} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Paper>
      )}

      {!selectedAreaId && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant='h6' color='text.secondary'>
            Selecciona un área de producción para ver los pedidos
          </Typography>
        </Box>
      )}
    </Container>
  );
};
