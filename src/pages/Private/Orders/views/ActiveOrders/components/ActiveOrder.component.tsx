import { FC, useCallback, useMemo } from 'react';

import { Card, Divider, Stack, alpha, useTheme } from '@mui/material';
import { addMinutes } from 'date-fns';

import { UpdateOrderDto } from '../../../dto/update-order.dto';
import { OrderStatus } from '../../../../../../models/orders.model';

import { Order } from '../../../../../../models';
import { statusModalStartOrder } from '../../../services/orders.service';
import { BtnAddProduct } from './BtnAddProduct.component';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateOrder } from '../../../hooks';
import { useOrderHelper } from '../../../hooks/useOrders';
import { ProductionArea } from '../../../../Common/models/production-area.model';
import { useProductionAreasStore } from '../../../../Common/store/production-areas-store';
import { ProductionAreaOrder } from './ProductionAreaOrder.component';
import { queryKeys } from '@/api/query-keys';
import { OrderCardHeader } from './OrderCardHeader.component';
import { OrderMetadata } from './OrderMetadata.component';
import { OrderActions } from './OrderActions.component';
import { useTimeUrgency } from '../../../hooks/useTimeUrgency';

interface Props {
  order: Order;
  setStatusFilter?: (status: OrderStatus) => void;
  color: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary';
  index: number;
  productionArea?: ProductionArea;
}

/* */
export const ActiveOrder: FC<Props> = ({
  order,
  setStatusFilter,
  color,
  index,
  productionArea
}) => {
  const theme = useTheme();
  const { getFirstPendingOrder } = useOrderHelper();
  const { productionAreas } = useProductionAreasStore();
  const queryClient = useQueryClient();
  const { mutate: updateOrder } = useUpdateOrder();
  const adjustedDeliveryTime = addMinutes(new Date(order.deliveryTime), 30);
  const timeUrgency = useTimeUrgency(adjustedDeliveryTime);

  // Prefetch order details for quick access
  useMemo(() => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.orders.detail(order.id),
      queryFn: () => order
    });
  }, [order, queryClient]);

  const handleStartOrder = useCallback(
    (order: Order) => {
      const firstOrder = getFirstPendingOrder();

      if (firstOrder.id === order.id) {
        changeStatusOrder(OrderStatus.IN_PROGRESS);
      } else {
        statusModalStartOrder.setSubject({ value: true, order });
      }
    },
    [getFirstPendingOrder]
  );

  const changeStatusOrder = useCallback(
    (status: OrderStatus) => {
      const data: UpdateOrderDto = {
        id: order.id,
        status
      };

      updateOrder(data);
    },
    [order.id, updateOrder]
  );

  return (
    <Card
      sx={{
        borderTop: `5px solid ${theme.palette[color].main}`,
        boxShadow: 'none',
        border: 1,
        borderColor: 'divider',
        // boxShadow:
        //   '0px 9px 16px rgba(159, 162, 191, .18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* */}
      <OrderCardHeader order={order} index={index} color={color} />

      {/* */}
      <OrderMetadata order={order} color={color} />

      {/* */}
      <Stack spacing={1.5} sx={{ px: 2, py: 1 }}>
        <Stack spacing={1.5} direction='column'>
          {productionAreas.map((area) => (
            <ProductionAreaOrder
              key={area.id}
              details={order.details}
              productionArea={area}
              orderId={order.id}
              order={order}
            />
          ))}
        </Stack>

        {/* */}
        <BtnAddProduct order={order} />
      </Stack>

      {/* */}
      {order.status !== OrderStatus.DELIVERED && <Divider sx={{ mt: 0.5 }} />}

      {/* */}
      <OrderActions
        order={order}
        onStartOrder={handleStartOrder}
        onChangeStatus={changeStatusOrder}
        setStatusFilter={setStatusFilter}
      />
    </Card>
  );
};
