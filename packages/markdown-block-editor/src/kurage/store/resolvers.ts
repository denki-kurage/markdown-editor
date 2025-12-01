import apiFetch from "@wordpress/api-fetch";

export const getSettings = () => async (p: any) =>
{
    const { dispatch } = p;

    try
    {
        const result = await apiFetch({
            path: '/markdown-block-editor/v1/settings'
        });

        dispatch({ type: 'SET_SETTINGS', value: result });
    }
    catch(ex: any)
    {
        console.log(ex)
    }
}