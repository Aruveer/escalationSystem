export const vibrateSoft = () => {
  if (navigator.vibrate) {
    // Two short, weak pulses
    navigator.vibrate([50, 50, 50]);
  }
};

export const vibrateAlert = () => {
  if (navigator.vibrate) {
    // A slightly longer pulse pattern
    navigator.vibrate([200, 100, 200]);
  }
};