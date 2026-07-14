import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
  Checkbox,
} from '@mui/material';
import type { TableProps } from '@mui/material';

export interface Column<T> {
  id: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
}

interface DataTableProps<T> extends Omit<TableProps, 'children'> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  rowId?: (row: T, index: number) => string | number;
  emptyMessage?: string;
  pagination?: boolean;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  totalCount?: number;
}

/**
 * Organismo: DataTable
 * 
 * Tabla de datos avanzada con paginación, selección y columnas personalizables.
 * 
 * @example
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={[
 *     { id: 'name', label: 'Nombre', render: (row) => row.name },
 *     { id: 'email', label: 'Email', render: (row) => row.email }
 *   ]}
 *   rowId={(row, index) => row.id}
 *   selectable
 *   onSelectionChange={setSelected}
 *   pagination
 *   page={page}
 *   rowsPerPage={rowsPerPage}
 *   totalCount={total}
 * />
 * ```
 */
export function DataTable<T>({
  data,
  columns,
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  rowId = (_row, index) => index,
  emptyMessage = 'No hay datos para mostrar',
  pagination = false,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
  ...props
}: DataTableProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      const newSelected = checked 
        ? new Set<string | number>(data.map((row, index) => rowId(row, index)))
        : new Set<string | number>();
      onSelectionChange(newSelected);
    }
  };

  const handleSelectRow = (row: T, index: number, checked: boolean) => {
    if (onSelectionChange) {
      const newSelected = new Set(selectedRows);
      const id = rowId(row, index);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      onSelectionChange(newSelected);
    }
  };

  const allSelected = data.length > 0 && data.every((row, index) => selectedRows.has(rowId(row, index)));
  const someSelected = selectedRows.size > 0 && !allSelected;

  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table {...props}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={someSelected}
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#002f6c',
                    width: column.width,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                  <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const id = rowId(row, index);
                const isSelected = selectedRows.has(id);
                return (
                  <TableRow
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    selected={isSelected}
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      '&:hover': onRowClick ? { bgcolor: 'rgba(148, 180, 60, 0.1)' } : {},
                      bgcolor: isSelected ? 'rgba(148, 180, 60, 0.15)' : 'inherit',
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(row, index, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {column.render ? column.render(row) : (row as any)[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount ?? data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      )}
    </Paper>
  );
}
