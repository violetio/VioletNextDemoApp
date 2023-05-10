import cx from 'classnames';
import styles from './Button.module.scss';
import Spinner from '@/components/Spinner/Spinner';

interface ButtonProps {
  className?: string;
  label: string;
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const Button = ({
  className,
  label,
  type,
  onClick,
  loading = false,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      className={cx(styles.button, className, {
        [styles.loading]: loading,
      })}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : <>{label}</>}
    </button>
  );
};

export default Button;
