import { Dialog, DialogTitle, DialogContent, DialogActions, type DialogProps } from '@mui/material';

interface CustomDialogProps extends Omit<DialogProps, 'title'> {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
}

/**
 * Átomo: CustomDialog
 * 
 * Dialog personalizado con título, contenido y acciones.
 * 
 * @example
 * ```tsx
 * <CustomDialog
 *   title="Confirmar acción"
 *   open={isOpen}
 *   onClose={handleClose}
 *   actions={
 *     <>
 *       <Button onClick={handleCancel}>Cancelar</Button>
 *       <Button onClick={handleConfirm}>Confirmar</Button>
 *     </>
 *   }
 * >
 *   <p>¿Está seguro de realizar esta acción?</p>
 * </CustomDialog>
 * ```
 */
export function CustomDialog({
  title,
  open,
  onClose,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}: CustomDialogProps) {
  return (
    <Dialog
      {...props}
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 12,
        },
        ...props.sx,
      }}
    >
      <DialogTitle sx={{ color: '#002f6c', fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
