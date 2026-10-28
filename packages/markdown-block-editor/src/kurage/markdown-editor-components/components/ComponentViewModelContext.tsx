import { createContext, useContext } from "react";
import { IComponentViewModels } from "../component-view-models";


const ComponentViewModelContext = createContext<IComponentViewModels>({} as any);

export const ComponentViewModelContextProvider = ComponentViewModelContext.Provider;
export const useComponentViewModels = () => useContext(ComponentViewModelContext);
export const useComponentServicesData = () => useContext(ComponentViewModelContext);
export const useSettingsComponentService = () => useComponentViewModels().settingsViewModel;

