import { create } from 'zustand'

const useStore = create((set, get) => ({
  viewState: 'overview',
  isAnimating: false,
  hovered: null,
  pageIndex: 0,
  lampOn: false,
  weatherData: null,
  openApp: null,
  dayMode: false,
  showAboutText: true,
  toggleAboutText: () => set((state) => ({ showAboutText: !state.showAboutText })),
setView: (name) => {
    if (get().viewState === name) return
    set({ viewState: name, isAnimating: true, showAboutText: true })
  },
  setOpenApp: (id) => set({ openApp: id }),
  setHovered: (name) => set({ hovered: name }),
  setIsAnimating: (bool) => set({ isAnimating: bool }),
  turnPage: (direction) =>
    set((state) => ({
      pageIndex: Math.max(0, Math.min(12, state.pageIndex + direction)),
    })),
  toggleLamp: () => set((state) => ({ lampOn: !state.lampOn })),
  toggleDayMode: () => set((state) => ({ dayMode: !state.dayMode })),
  setWeather: (data) => set({ weatherData: data }),
}))

export default useStore
