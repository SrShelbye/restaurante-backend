import React, { FC } from 'react';
import { BillDetail } from '../../../../models/bill-detail.model';
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from '@mui/material';
import { formatMoney } from '../../Common/helpers/format-money.helper';


interface Props {
  details: BillDetail[];
}

/* */
export const BillDetailsTable: FC<Props> = ({ details }) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cantidad</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>IVA</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {details.map((detail) => (
            <TableRow key={detail.id}>
              <TableCell align='center'>{detail.quantity}</TableCell>
              <TableCell>{detail.orderDetail.product.name}</TableCell>
              <TableCell align='right'>
                {formatMoney(detail.orderDetail.price)}
              </TableCell>
              <TableCell align='right'>
                {formatMoney(detail.orderDetail.price)}
                {/* */}
              </TableCell>
              <TableCell align='right'>{formatMoney(detail.total)}</TableCell>
            </TableRow>
          ))}

          {/* */}
        </TableBody>
      </Table>
    </>
  );
};
