import Modal from './Modal.jsx';
import Button from '../buttons/Button.jsx';
export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} footer={<><Button onClick={onCancel}>Cancel</Button><Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button></>}>
      <p>{message}</p>
    </Modal>
  );
}
