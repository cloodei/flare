import { create } from "zustand";

interface LEDState {
  id: number;
  color: "Red" | "Green" | "Yellow" | "RGB";
  state: boolean;
}
interface RelayState {
  id: number;
  name: string;
  room: string;
  state: boolean;
}
interface ControlsState {
  led: LEDState[];
  relay: RelayState[];
  piOnline: boolean;
  dht: null | {
    room: string;
    online: boolean;
  };
  
  actions: {
    setLED: (led: LEDState[]) => void;
    setRelay: (relay: RelayState[]) => void;
    setPiOnline: (piOnline: boolean) => void;
    setDHT: (dht: { room: string; online: boolean; } | null) => void;
  };
}

const useControlsStore = create<ControlsState>()((set) => ({
  piOnline: false,
  led: [],
  relay: [],
  dht: null,

  actions: {
    setPiOnline: (piOnline) => set({ piOnline }),
    setLED: (led) => set({ led }),
    setRelay: (relay) => set({ relay }),
    setDHT: (dht) => set({ dht })
  }
}));

const useDHT             = () => useControlsStore(state => state.dht);
const useLED             = () => useControlsStore(state => state.led);
const useRelay           = () => useControlsStore(state => state.relay);
const usePiOnline        = () => useControlsStore(state => state.piOnline);
const useControlsActions = () => useControlsStore(state => state.actions);

export { useLED, useRelay, usePiOnline, useControlsActions, useDHT };
