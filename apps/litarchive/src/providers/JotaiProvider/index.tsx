import { Provider, atom, createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

const litArchiveStore = createStore();

const storageFontSize = atomWithStorage("fontSize", 20);
export const fontSize = atom(
  (get) => get(storageFontSize),
  (_get, set, newFontSize: number) => {
    if (newFontSize < 12) {
      set(storageFontSize, 12);
    } else if (newFontSize > 30) {
      set(storageFontSize, 30);
    } else {
      set(storageFontSize, newFontSize);
    }
  }
);

export default function JotaiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={litArchiveStore}>{children}</Provider>;
}
