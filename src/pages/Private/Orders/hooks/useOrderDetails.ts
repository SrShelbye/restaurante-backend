import { CreateOrderDetailDto } from '../dto/create-order.dto';
import { EventsEmitSocket } from '../interfaces/events-sockets.interface';
import { useSnackbar } from 'notistack';
import { useEmitWebSocketsEvent } from '../../../../hooks';
import { Order } from '../../../../models';
import { DeleteOrderDetailDto, UpdateOrderDetailDto } from '../dto';

/* */
export const useCreateOrderDetail = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useEmitWebSocketsEvent<Order, CreateOrderDetailDto>(
    EventsEmitSocket.addOrderDetail,
    {
      onSuccess: (resp) => {
        enqueueSnackbar(resp.msg, { variant: 'success' });
      },
      onError: (resp) => {
        enqueueSnackbar(resp.msg, { variant: 'error' });
      }
    }
  );
};

/* */
export const useUpdateOrderDetail = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useEmitWebSocketsEvent<Order, UpdateOrderDetailDto>(
    EventsEmitSocket.updateOrderDetail,
    {
      onSuccess: (resp) => {
        enqueueSnackbar(resp.msg, { variant: 'success' });
      },
      onError: (resp) => {
        enqueueSnackbar(resp.msg, { variant: 'error' });
      }
    }
  );
};

/* */
export const useDeleteOrderDetail = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useEmitWebSocketsEvent<Order, DeleteOrderDetailDto>(
    EventsEmitSocket.deleteOrderDetail,
    {
      onSuccess: (resp) => {
        enqueueSnackbar(resp.msg, { variant: 'success' });
      },
      onError: (resp) => {
        enqueueSnackbar(resp.msg, { variant: 'error' });
      }
    }
  );
};
