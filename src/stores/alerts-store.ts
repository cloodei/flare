import { create } from "zustand";

interface Alert {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  room: string;
}

interface AlertsState {
  alerts: Alert[];
  actions: {
    addAlert: (alert: Alert) => void;
    removeAlert: (id: number) => void;
    clearAlerts: () => void;
  };
}

const useAlertsStore = create<AlertsState>()((set) => ({
  alerts: [],
  actions: {
    addAlert: (alert: Alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
    removeAlert: (id: number) => set((state) => ({ alerts: state.alerts.filter((alert) => alert.id !== id) })),
    clearAlerts: () => set(() => ({ alerts: [] })),
  },
}))

const useAlerts = () => useAlertsStore((state) => state.alerts);
const useAlertsActions = () => useAlertsStore((state) => state.actions);

export { useAlerts, useAlertsActions };
