/**
 * Maximum number of months to simulate in savings calculations.
 *
 * This limit prevents infinite loops in edge cases where:
 * - Interest rate is too low relative to goal
 * - Monthly surplus is very small
 * - Goal is unrealistically high
 *
 * 10,000 months = ~833 years, which is beyond any practical savings timeline.
 * If this limit is reached, it indicates the goal is likely unattainable with
 * the current parameters.
 */
export const MAX_SIMULATION_MONTHS = 10000;

/**
 * Debounce delay in milliseconds for input changes.
 *
 * This delay batches rapid user edits (e.g., typing in number fields) to prevent
 * excessive recalculations. The calculation runs only after the user pauses typing
 * for 200ms, improving performance and preventing UI lag during data entry.
 */
export const DEBOUNCE_DELAY_MS = 200;

/**
 * Height of the Chart.js visualization in pixels.
 *
 * Provides consistent chart sizing across the application.
 */
export const CHART_HEIGHT_PX = 300;

/**
 * Default interest rate percentage for savings calculations.
 *
 * Represents a typical annual percentage yield (APY) for savings accounts.
 * Users can override this value through the UI.
 */
export const DEFAULT_INTEREST_RATE_PERCENT = 1.2;
