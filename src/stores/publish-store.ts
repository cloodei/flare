import { create } from "zustand";

interface PublishState {
  publish: (topic: string, message: string) => void;
  setPublish: (publishFn: (topic: string, message: string) => void) => void;
}
const usePublishStore = create<PublishState>()(set => ({
  publish: (topic: string, message: string) => {}, // eslint-disable-line
  setPublish: (publishFn: (topic: string, message: string) => void) => set({ publish: publishFn })
}))

const usePublish    = () => usePublishStore(state => state.publish);
const useSetPublish = () => usePublishStore(state => state.setPublish);

export { usePublish, useSetPublish }
