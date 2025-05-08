
'use server';

/**
 * @fileOverview Server action to get a simulated visitor count for the current 24-hour period.
 * The count resets daily (UTC) and attempts to simulate accumulation of visitors.
 */

export async function getVisitorCount(): Promise<{ count: number }> {
  const now = new Date();
  
  // Calculate a seed based on the current day (YYYYMMDD format)
  // This ensures that the "randomness" or base variation is consistent for the same day
  // but different across days, making the daily base count vary.
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-11
  const day = now.getUTCDate(); // 1-31
  
  // Create a numeric seed from the date components
  const dailySeed = parseInt(`${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`);

  // A small, pseudo-random base number of "initial" visitors for the day.
  // This value changes daily based on the dailySeed.
  // Example range: 10 to (10 + 22 + 18) = 50
  const baseVariation1 = (dailySeed % 23); // Range 0-22
  const baseVariation2 = (dailySeed % 19); // Range 0-18
  const dailyInitialBase = 10 + baseVariation1 + baseVariation2; // Ensures a base of at least 10, max around 50.

  // Number of minutes passed since the beginning of the current UTC day.
  // This is the primary driver for simulating visitor accumulation.
  // Max value: (23 hours * 60 minutes/hour) + 59 minutes = 1380 + 59 = 1439
  const minutesIntoDay = (now.getUTCHours() * 60) + now.getUTCMinutes();

  // Simulate visitor accumulation:
  // The rate of accumulation varies slightly each day.
  // e.g., 1 "visitor" arrives every N minutes, where N is between 3 and 6.
  const accumulationRateFactor = (dailySeed % 4) + 3; // Results in a divisor between 3 and 6
  const accumulatedVisitors = Math.floor(minutesIntoDay / accumulationRateFactor);
  
  // Add a tiny random fluctuation per request to simulate more "live" activity.
  // This fluctuation is also seeded by the day to be somewhat consistent in its range.
  const randomFluctuationMax = (dailySeed % 3) + 1; // Results in max fluctuation of 1, 2, or 3
  const smallRandomFluctuation = Math.floor(Math.random() * randomFluctuationMax); // Fluctuation of 0, 1, or 2

  let count = dailyInitialBase + accumulatedVisitors + smallRandomFluctuation;

  // Ensure count is always non-negative.
  count = Math.max(0, count);
  
  // Simulate a network delay, as if fetching from a database.
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300)); 
  
  return { count };
}

