import { FC, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Typography,
  Chip,
  Badge,
  Box,
  alpha,
  useTheme
} from '@mui/material';
import { ExpandMore, Restaurant } from '@mui/icons-material';
import { ConsolidatedProduct } from '../../hooks/useConsolidatedProducts';
import { ProductSourceItem } from './ProductSourceItem.component';

interface Props {
  product: ConsolidatedProduct;
  defaultExpanded?: boolean;
}

/* */
export const ConsolidatedProductItem: FC<Props> = ({
  product,
  defaultExpanded = false
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        '&:before': {
          display: 'none'
        },
        borderRadius: '8px !important',
        mb: 1,
        overflow: 'hidden',
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
        '&:hover': {
          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.12)}`
        },
        transition: 'all 0.2s ease'
      }}
    >
      {/* */}
      <AccordionSummary
        expandIcon={
          <ExpandMore
            sx={{
              color: theme.palette.text.secondary,
              fontSize: 28
            }}
          />
        }
        sx={{
          px: 2,
          py: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.05)
          },
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            my: 1
          }
        }}
      >
        <Stack
          direction='row'
          spacing={2}
          alignItems='center'
          sx={{ width: '100%', pr: 2 }}
        >
          {/* */}
          <Box
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              color: theme.palette.primary.main,
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Restaurant fontSize='small' />
          </Box>

          {/* */}
          <Stack spacing={0.5} flexGrow={1}>
            <Typography variant='subtitle1' fontWeight={600}>
              {product.productName}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {product.sources.length}{' '}
              {product.sources.length === 1 ? 'pedido' : 'pedidos'}
            </Typography>
          </Stack>

          {/* */}
          <Typography variant='h6' fontWeight={600}>
            {product.totalPending}
          </Typography>
        </Stack>
      </AccordionSummary>

      {/* */}
      <AccordionDetails sx={{ p: 0 }}>
        <Stack
          spacing={0.5}
          sx={{ bgcolor: alpha(theme.palette.divider, 0.02) }}
        >
          {product.sources.map((source, index) => (
            <Box
              key={`${source.orderId}-${source.detailId}`}
              sx={{
                borderBottom:
                  index < product.sources.length - 1
                    ? `1px solid ${alpha(theme.palette.divider, 0.08)}`
                    : 'none'
              }}
            >
              <ProductSourceItem source={source} />
            </Box>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
