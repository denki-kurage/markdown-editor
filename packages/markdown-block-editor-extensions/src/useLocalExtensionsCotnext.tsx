import { ExtensionContexts } from "@kurage/markdown-block-editor";
import { createContext, useContext } from "@wordpress/element";

export const Context = createContext<ExtensionContexts>(null as any);
export const useLocalExtensionsCotnext = () => useContext(Context);
