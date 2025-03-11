export const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-2858704759926400',
  slots: {
    leaderboard: '12334567890', // Replace with your actual leaderboard ad slot ID
    mediumRectangle: '0987654321', // Replace with your actual medium rectangle ad slot ID
    largeRectangle: '1122334455', // Replace with your actual large rectangle ad slot ID
  },
  testMode: process.env.NODE_ENV === 'development',
} as const;

export type AdSlotType = keyof typeof ADSENSE_CONFIG.slots;