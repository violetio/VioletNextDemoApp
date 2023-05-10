import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment, ReactNode } from 'react';
import cx from 'classnames';
import styles from './Dropdown.module.scss';

const CLEAR_SELECTION = 'Clear Selection';

interface DropdownProps {
  classes?: { [key: string]: string };
  value: string;
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
  disabledRow?: (value: string) => boolean;
  customButton?: ReactNode;
  clearOption?: boolean;
  disabled?: boolean;
}

const Dropdown = ({
  classes = {},
  value,
  options,
  placeholder,
  onChange,
  disabledRow,
  customButton,
  clearOption = true,
  disabled = false,
}: DropdownProps) => {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={cx(styles.list, classes.list)}>
        {customButton ? (
          <>{customButton}</>
        ) : (
          <Listbox.Button className={cx(styles.listButton, classes.listButton)}>
            <span className={styles.value}>{value || placeholder}</span>
            <span className={styles.chevronIcon}>
              <ChevronDownIcon className={styles.icon} aria-hidden="true" />
            </span>
          </Listbox.Button>
        )}
        <Transition
          as={Fragment}
          leave={styles.transitionLeave}
          leaveFrom={styles.transitionLeaveFrom}
          leaveTo={styles.transitionLeaveto}
        >
          <Listbox.Options className={cx(styles.options, classes.options)}>
            {clearOption && (
              <Listbox.Option
                className={({ active }) =>
                  cx(styles.option, {
                    [styles.active]: active,
                  })
                }
                value={CLEAR_SELECTION}
              >
                {({ selected, disabled }) => (
                  <>
                    <span
                      className={cx(styles.row, styles.clear, {
                        [styles.selected]: selected,
                        [styles.disabled]: disabled,
                      })}
                    >
                      {CLEAR_SELECTION}
                    </span>
                  </>
                )}
              </Listbox.Option>
            )}
            {options.map((option) => (
              <Listbox.Option
                key={option}
                className={({ active }) =>
                  cx(styles.option, {
                    [styles.active]: active,
                  })
                }
                value={option}
                disabled={disabledRow?.(option)}
              >
                {({ selected, disabled }) => (
                  <>
                    <span
                      className={cx(styles.row, {
                        [styles.selected]: selected,
                        [styles.disabled]: disabled,
                      })}
                    >
                      {option}
                    </span>
                    {selected ? (
                      <span className={styles.checkIcon}>
                        <CheckIcon className={styles.icon} aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Dropdown;
