// This is the only interface class you have in components. Everywhere else you
// seem to just declare those interfaces in the component itself. Should we just
// do that for Spinner for consistency?
interface SpinnerProps {
  /**
   * Diameter of ring
   */
  diameter?: number;
  /**
   * Stroke width of ring
   */
  strokeWidth?: number;
  /**
   * Color of the spinner ring
   */
  ringColor?: string;
  /**
   * Color of the quarter ring
   */
  quarterColor?: string;
}

export default SpinnerProps;
