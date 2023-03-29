import cx from "classnames";
import { ReactElement, useEffect, useRef, useState } from "react";
import ChevronDownIcon from "@/public/svg/chevron-down.svg";
import styles from "./Select.module.scss";

export interface VioletSelectProps {
  /**
   * Class name for button element
   */
  className?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Value of the select element
   */
  value?: string;
  /**
   * list of options for the select dropdown
   */
  options: string[];
  /**
   * Callback fired when a value is selected
   */
  indexSelected?: (index: number) => boolean;
  /**
   * Callback to render single option
   */
  renderOption: (value: string, index: number) => ReactElement;
  /**
   * Callback to render selected option
   */
  renderSelectedOption: () => ReactElement;
}

interface HoveredOption {
  /**
   * The string value being hovered
   */
  value: string;
  /**
   * The index of the hovered value
   */
  index: number;
}

/**
 * Violet Select component
 *
 * @returns
 */
const VioletSelect = ({
  className,
  placeholder,
  value,
  options,
  indexSelected,
  renderOption,
  renderSelectedOption,
}: VioletSelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const searchTimerRef = useRef<number | null>(null);
  const [focused, setFocused] = useState(false);

  const defaultHoveredOption = (value?: string) => ({
    value: value || options[0],
    index: value ? options.findIndex((option) => option === value) : 0,
  });

  const [hoveredOption, setHoveredOption] = useState<HoveredOption>(
    defaultHoveredOption(value)
  );

  const optionsRefs = useRef<Array<HTMLDivElement>>([]);

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [focused]);

  const findMatchingOption = (inputValue: string) => {
    // Find first string that starts with input otherwise default to first value
    let index = 0;
    for (const option of options) {
      if (option.toUpperCase().startsWith(inputValue.toUpperCase())) {
        setHoveredOption({
          value: option,
          index,
        });
        optionsRefs.current[index].scrollIntoView({ block: "nearest" });
        return;
      }
      index++;
    }
    setHoveredOption({
      value: options[0],
      index: 0,
    });
  };

  const inputOnChange = (inputValue: string) => {
    // Find new hoveredOption based on input
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = window.setTimeout(() => {
      findMatchingOption(inputValue);
    }, 50);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }, 1000);
  };
  return (
    <fieldset
      className={cx(styles.violetSelect, className, {
        [styles.focused]: focused,
        [styles.valueSelected]: value,
      })}
      onClick={(e) => {
        setFocused((prevFocused) => !prevFocused);
        setHoveredOption(defaultHoveredOption(value));
      }}
      onMouseDown={(e) => e.preventDefault()}
      onBlur={() => setFocused(false)}
    >
      {/* This placeholder is overlayed in the box when there is no value and will slide to the gap created by the legend tag when the input is focused */}
      <div
        className={cx(styles.legendText, {
          [styles.focused]: focused,
          [styles.valueSelected]: value,
        })}
      >
        {placeholder}
      </div>
      {/* This legend creates the gap in the fieldset border for the text above to slide into */}
      {(focused || value) && (
        <legend className={styles.hiddenLegend}>{placeholder}</legend>
      )}
      {/* We create an input field here to capture key strokes */}
      <input
        ref={inputRef}
        className={styles.hiddenInput}
        onFocus={(e) => {
          e.target.value = "";
          setFocused(true);
        }}
        onChange={(e) => inputOnChange(e.target.value)}
        onKeyDown={(e) => {
          // Allow the arrow keys to navigate between the dropdown options
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            if (!focused) {
              setFocused(true);
            } else {
              // Decrease the index on arrow up
              if (e.key === "ArrowUp") {
                const index =
                  hoveredOption.index > 0 ? hoveredOption.index - 1 : 0;
                optionsRefs.current[index].scrollIntoView({ block: "nearest" });
                setHoveredOption({
                  value:
                    hoveredOption.index > 0
                      ? options[hoveredOption.index - 1]
                      : options[0],
                  index,
                });
              } else {
                // Increase the index on arrow down
                const index =
                  hoveredOption.index < options.length - 1
                    ? hoveredOption.index + 1
                    : options.length - 1;
                optionsRefs.current[index].scrollIntoView({ block: "nearest" });
                setHoveredOption({
                  value:
                    hoveredOption.index < options.length - 1
                      ? options[hoveredOption.index + 1]
                      : options[options.length - 1],
                  index,
                });
              }
            }
          }
          if (e.key === "Enter") {
            indexSelected?.(hoveredOption.index);
            setFocused(false);
            e.preventDefault();
          }
        }}
      />
      <div className={styles.valueLabel}>{renderSelectedOption()}</div>
      <ChevronDownIcon
        className={cx(styles.chevronDown, {
          [styles.flipped]: focused,
        })}
      />
      {focused && (
        <div className={styles.options}>
          {options.map((option, index) => (
            <div
              ref={(ref: HTMLDivElement) => (optionsRefs.current[index] = ref)}
              key={option}
              className={cx(styles.option, {
                [styles.customHover]: index === hoveredOption.index,
              })}
              onClick={() => {
                indexSelected?.(index);
              }}
              onMouseMove={() => {
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
                setHoveredOption({
                  value: option,
                  index,
                });
              }}
            >
              {renderOption(option, index)}
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
};

export default VioletSelect;
