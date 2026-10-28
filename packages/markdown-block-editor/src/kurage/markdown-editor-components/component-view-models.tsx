import { ISettings } from "../store/ISettings";

export interface ISettingsViewModel
{
    isLoading: boolean;
    errorMessage: string | undefined;
    updateFontFamily(fontFamily: string): void;
    updateFontSize(fontSize: number): void;
    updateSettings(settings: Partial<ISettings>): void;
}

export interface IComponentViewModels
{
    settingsViewModel: ISettingsViewModel;
}



