import cx from 'classnames';
import { ChangeEventHandler, LegacyRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import styles from './Input.module.scss';

interface Props {
  className?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  ref?: LegacyRef<HTMLInputElement>;
  error?: string;
}

/**
 * Panel component for displaying product information and
 * controls for a user to add a specific product SKU to a cart.
 */
const Input = ({
  className,
  label,
  value,
  placeholder,
  onChange,
  ref,
  error,
}: Props) => {
  return (
    <div className={cx(styles.inputContainer, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.inputWrapper}>
        <input
          className={cx(styles.input, {
            [styles.error]: error,
          })}
          ref={ref}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        {error && <ExclamationCircleIcon className={styles.errorIcon} />}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Input;
