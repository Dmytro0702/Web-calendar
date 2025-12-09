import { Toast } from './Toast';
import styles from './ToastContainer.module.scss';

/**
 * ToastContainer — список всех уведомлений
 */
export const ToastContainer = ({ toasts, remove }) => {
  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
};
