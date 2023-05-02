import ISpinnerProps from './Spinner.interface';
import styles from './Spinner.module.scss';

export const RING_COLOR = '#DCD8E44D';
export const QUARTER_COLOR = '#DCD8E4';
export const DEFAULT_DIAMETER = 20;
export const DEFAULT_STROKE_WIDTH = 1;

const Spinner = ({
  diameter = DEFAULT_DIAMETER,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  ringColor = RING_COLOR,
  quarterColor = QUARTER_COLOR,
}: ISpinnerProps): JSX.Element => {
  return (
    <div
      className={styles.spinnerRing}
      style={{
        minWidth: diameter,
        minHeight: diameter,
        width: diameter,
        height: diameter,
        border: `${strokeWidth}px solid ${ringColor}`,
        borderTop: `${strokeWidth}px solid ${quarterColor}`,
      }}
    />
  );
};

export default Spinner;
