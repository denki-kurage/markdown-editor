import { combineReducers } from "@wordpress/data";
import { EditorState, IMarkdownBlockEditorInfo, IMarkdownBlockEditorState } from "./type";


const info = (state: IMarkdownBlockEditorInfo = { version: '0.1' }, action: any) =>
{
    switch(action.type)
    {
        case 'SET_INFO_VERSION':
            return { ...state, version: action.version }
    }
    return state;
}

const editorStates = (state: EditorState = {}, action: any) =>
{
    switch(action.type)
    {
        case 'SET_EDITOR_STATE':
            return { ...state, [action.id]: action.editorState }
        case 'DELETE_EDITOR_STATE':
            delete state[action.id];
            return { ...state }
        case 'SET_EDITOR_EXTENSION_DATA':
            const editorState = state[action.id];
            const extensionName = action.extensionName;
            const extensionData = action.extensionData;
            const newExtensionData = { ...editorState.extensionsData, [extensionName]: extensionData }
            
            return { ...state, [action.id]: { ...editorState, extensionData: newExtensionData }}
    }

    return state;
}

export default combineReducers({
    info,
    editorStates
})
