import apiFetch from "@wordpress/api-fetch";

export const getSettings = () => async (p: any) =>
{
    const { dispatch } = p;

    try
    {
        const settings = await apiFetch({
            path: '/markdown-block-editor/v1/settings'
        });

        dispatch({ type: 'SET_SETTINGS', value: settings });
    }
    catch(ex: any)
    {
        console.log(ex)
    }
}

export const getSettingOptions = () => async (p: any) =>
{
    const { dispatch } = p;

    try
    {
        const settingOptions = await apiFetch({
            path: '/markdown-block-editor/v1/setting-options'
        });

        dispatch({ type: 'SET_SETTING_OPTIONS', value: settingOptions });
    }
    catch(ex: any)
    {
        console.log(ex)
    }
}