import { create } from "zustand";

interface LEDState {
  id: number;
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
  
  actions: {
    setLED: (led: LEDState[]) => void;
    setRelay: (relay: RelayState[]) => void;
  };
}

const useControlsStore = create<ControlsState>()((set) => ({
  led: [],
  relay: [],

  actions: {
    setLED: (led) => set({ led }),
    setRelay: (relay) => set({ relay })
  }
}));

const useLED             = () => useControlsStore(state => state.led);
const useRelay           = () => useControlsStore(state => state.relay);
const useControlsActions = () => useControlsStore(state => state.actions);

export { useLED, useRelay, useControlsActions };
