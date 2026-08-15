import { create } from 'zustand'

const useStore = create((set, get) => ({
  viewState: 'overview',
  isAnimating: false,
  hovered: null,
  sceneReady: false,
  pageIndex: 0,
  lampOn: false,
  weatherData: null,
  openApp: null,
  dayMode: false,

  setView: (name) => {
    if (get().isAnimating) return
    // re-entering the view you are already in would raise isAnimating with no
    // camera move left to lower it again
    if (get().viewState === name) return
    // leaving the laptop closes whatever app was open, so returning to it
    // starts at the desktop and the global Back button is never left hidden
    set({ viewState: name, isAnimating: true, openApp: name === 'laptop' ? get().openApp : null })
  },
  setOpenApp: (id) => set({ openApp: id }),
  setHovered: (name) => set({ hovered: name }),
  setSceneReady: () => set({ sceneReady: true }),
  setIsAnimating: (bool) => set({ isAnimating: bool }),
  turnPage: (direction) =>
    set((state) => ({
      pageIndex: Math.max(0, Math.min(12, state.pageIndex + direction)),
    })),
  toggleLamp: () => set((state) => ({ lampOn: !state.lampOn })),
  toggleDayMode: () => set((state) => ({ dayMode: !state.dayMode })),
  setWeather: (data) => set({ weatherData: data }),
}))

if (typeof window !== 'undefined') window.__store = useStore

export default useStore
