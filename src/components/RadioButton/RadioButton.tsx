import cx from 'classnames';
import { useEffect, useState } from 'react';
import styles from './RadioButton.module.scss';

export interface RadioButtonProps {
  /**
   * Class name for button element
   */
  className?: string;
  /**
   * Value of the select element
   */
  value?: boolean;
  /**
   * Callback fired when the radio button value is changed
   */
  onChange?: (value: boolean) => void;
}

const RadioButton = ({ className, value, onChange }: RadioButtonProps) => {
  const [active, setActive] = useState(value);

  useEffect(() => {
    // Update the value if changed externally
    setActive(value);
  }, [value]);

  return (
    <div
      className={cx(styles.radioButton, className, {
        [styles.active]: active,
      })}
      onClick={() =>
        setActive((prev) => {
          onChange?.(!prev);
          return !prev;
        })
      }
    >
      {active && <div className={styles.activeCircle} />}
    </div>
  );
};

export default RadioButton;
