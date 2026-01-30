import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import restauranteApi from '../../../../api/restauranteApi';
import { Order } from '../../../../models/orders.model';

interface ProductionAreaOrder {
  _id: string;
  orderNumber: string;
  tableId?: any;
  details: Array<{
    _id: string;
    productId: {
      _id: string;
      name: string;
      category: string;
      productionAreaId: {
        _id: string;
        name: string;
        description: string;
      };
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: string;
    notes?: string;
  }>;
  subtotal: number;
  total: number;
  status: string;
  orderType: string;
  customerName?: string;
  createdAt: string;
  updatedAt: string;
}

export const useProductionAreaOrders = (productionAreaId?: string) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string | undefined>(productionAreaId);

  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery<ProductionAreaOrder[]>({
    queryKey: ['production-area-orders', selectedAreaId],
    queryFn: async () => {
      if (!selectedAreaId) return [];
      
      const response = await restauranteApi.get(`/orders/production-area/${selectedAreaId}`);
      return response.data.data.orders;
    },
    enabled: !!selectedAreaId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  useEffect(() => {
    if (productionAreaId && productionAreaId !== selectedAreaId) {
      setSelectedAreaId(productionAreaId);
    }
  }, [productionAreaId, selectedAreaId]);

  const getOrdersForArea = (areaId: string) => {
    setSelectedAreaId(areaId);
  };

  const getFilteredOrders = () => {
    if (!selectedAreaId) return orders;
    
    return orders.filter(order => 
      order.details.some(detail => 
        detail.productId?.productionAreaId?._id === selectedAreaId
      )
    );
  };

  const getOrdersByStatus = (status: string) => {
    return getFilteredOrders().filter(order => 
      order.status === status
    );
  };

  const getPendingOrders = () => getOrdersByStatus('active');
  const getPreparingOrders = () => getOrdersByStatus('preparing');
  const getReadyOrders = () => getOrdersByStatus('ready');

  const updateOrderDetailStatus = async (orderId: string, detailId: string, status: string) => {
    try {
      await restauranteApi.patch(`/orders/${orderId}/details/${detailId}`, {
        status
      });
      refetch();
    } catch (error) {
      console.error('Error updating order detail status:', error);
    }
  };

  return {
    orders: getFilteredOrders(),
    pendingOrders: getPendingOrders(),
    preparingOrders: getPreparingOrders(),
    readyOrders: getReadyOrders(),
    isLoading,
    error,
    refetch,
    getOrdersForArea,
    selectedAreaId,
    updateOrderDetailStatus
  };
};
