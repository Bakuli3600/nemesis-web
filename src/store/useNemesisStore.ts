import { create } from 'zustand';

interface Activity {
  id: string;
  type: 'threat' | 'blockchain' | 'honeypot' | 'scan' | 'intel';
  msg: string;
  timestamp: string;
}

interface NemesisState {
  globalRiskScore: number;
  totalScans: number;
  threatsDetected: number;
  blockchainAnchors: number;
  activities: Activity[];
  setGlobalRiskScore: (score: number) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  incrementScans: () => void;
  incrementThreats: () => void;
  incrementAnchors: () => void;
}

export const useNemesisStore = create<NemesisState>((set) => ({
  globalRiskScore: 42,
  totalScans: 124,
  threatsDetected: 12,
  blockchainAnchors: 86,
  activities: [
    {
      id: '1',
      type: 'scan',
      msg: 'Neural grid initialization complete. Sensors operational.',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'blockchain',
      msg: 'Polygon node synchronization established.',
      timestamp: new Date().toISOString()
    }
  ],
  setGlobalRiskScore: (score) => set({ globalRiskScore: score }),
  addActivity: (activity) => set((state) => ({
    activities: [
      {
        ...activity,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString()
      },
      ...state.activities
    ].slice(0, 100)
  })),
  incrementScans: () => set((state) => ({ totalScans: state.totalScans + 1 })),
  incrementThreats: () => set((state) => ({ threatsDetected: state.threatsDetected + 1 })),
  incrementAnchors: () => set((state) => ({ blockchainAnchors: state.blockchainAnchors + 1 }))
}));
