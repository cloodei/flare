import { create } from "zustand"

type RoomData = {
  [key: string]: {
    time: Date
    temperature: number
    humidity: number
  }[]
}
interface RoomStore {
  room: string
  roomData: RoomData

  actions: {
    setRoom: (room: string) => void
    setRoomData: (roomData: RoomData) => void
  }
}
const useRoomStore = create<RoomStore>()((set) => ({
  room: "",
  roomData: {},
  
  actions: {
    setRoom: (room: string) => set({ room }),
    setRoomData: (roomData: RoomData) => set({ roomData })
  }
}))

const useRoom        = () => useRoomStore(state => state.room)
const useRoomData    = () => useRoomStore(state => state.roomData)
const useRoomActions = () => useRoomStore(state => state.actions)

export { useRoom, useRoomData, useRoomActions }
