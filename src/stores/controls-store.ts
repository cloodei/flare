import { create } from "zustand";

interface LEDState {
  id: number;
  color: "Red" | "Green" | "Yellow" | "RGB";
  state: boolean;
}
interface RelayState {
  id: number;
  name: string;
  state: boolean;
}
interface ControlsState {
  led: LEDState[];
  relay: RelayState[];
  piOnline: boolean;
  
  actions: {
    setLED: (led: LEDState[]) => void;
    setRelay: (relay: RelayState[]) => void;
    setPiOnline: (piOnline: boolean) => void;
  };
}

const useControlsStore = create<ControlsState>()((set) => ({
  piOnline: false,
  led: [],
  relay: [],

  actions: {
    setPiOnline: (piOnline) => set({ piOnline }),
    setLED: (led) => set({ led }),
    setRelay: (relay) => set({ relay })
  }
}));

const useLED             = () => useControlsStore(state => state.led);
const useRelay           = () => useControlsStore(state => state.relay);
const usePiOnline        = () => useControlsStore(state => state.piOnline);
const useControlsActions = () => useControlsStore(state => state.actions);

export { useLED, useRelay, usePiOnline, useControlsActions };
