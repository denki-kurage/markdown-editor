import apiFetch from "@wordpress/api-fetch"
import { IMarkdownBlockEditorState, IStoreState } from "./type";
import { ISettings } from "./ISettings";

export const setInfoVersion = (version: string) =>
{
    return { type: 'SET_INFO_VERSION', version }
}


export const setEditorState = (id: string, editorState: Partial<IMarkdownBlockEditorState>) =>
{
    return { type: 'SET_EDITOR_STATE', id, editorState }
}

export const deleteEditorState = (id: string) =>
{
    return { type: 'DELETE_EDITOR_STATE', id }
}

export const setExtensionData = (id: string, extensionName: string, extensionData: any) =>
{
    return { type: 'SET_EDITOR_EXTENSION_DATA', id, extensionName, extensionData }
}

export const setStoreState = (storeState: IStoreState) =>
{
    return { type: 'SET_STORE_STATE', value: storeState }
}



const sleep = (ts: number) => new Promise((r) => setTimeout(r, ts));

export const updateSettings = (settings: Partial<ISettings>) => async (p: any) =>
{
    const { dispatch, select } = p;
    const state = select.getStoreState();

    dispatch({ type: 'SET_SETTINGS', value: settings })

    if(state.isLoading)
    {
        return;
    }
    
    dispatch.setStoreState({ isLoading: true, faultMessage: '' } as IStoreState);

    try
    {
        let preSettings: any;
        let current: any;
        let counter = 0;

        while(preSettings !== (current = select.getSettings()))
        {
            await apiFetch({
                path: '/markdown-block-editor/v1/settings',
                method: 'POST',
                data: current
            });

            if(++counter > 3)
            {
                break;
            }
            
            await sleep(3000);

            preSettings = current;
        }

        dispatch.setStoreState({ isLoading: false, faultMessage: '' } as IStoreState);
    }
    catch(ex: any)
    {
        dispatch.setStoreState({ isLoading: false, faultMessage: ex.message ?? '' } as IStoreState);
    }
}




