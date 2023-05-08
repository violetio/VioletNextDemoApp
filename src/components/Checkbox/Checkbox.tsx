import cx from 'classnames';
import { useEffect, useState } from 'react';
import styles from './Checkbox.module.scss';
import CheckIcon from '@/public/svg/check.svg';

export interface CheckboxProps {
  /**
   * Class name for checkbox element
   */
  className?: string;
  /**
   * Value of the select element
   */
  value?: boolean;
  /**
   * Callback fired when the checkbox value is changed
   */
  onChange?: (value: boolean) => void;
}

const Checkbox = ({ className, value, onChange }: CheckboxProps) => {
  const [checked, setChecked] = useState(value);

  useEffect(() => {
    // Update the value if changed externally
    setChecked(value);
  }, [value]);

  return (
    <div
      className={cx(styles.checkbox, className, {
        [styles.checked]: checked,
      })}
      onClick={() =>
        setChecked((prev) => {
          onChange?.(!prev);
          return !prev;
        })
      }
    >
      {checked && <CheckIcon className={styles.checkmark} />}
    </div>
  );
};

export default Checkbox;
