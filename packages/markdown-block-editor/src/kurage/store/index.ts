import { createReduxStore, dispatch, register, select } from "@wordpress/data";
import * as selectors from './selectors'
import * as actions from './actions'
import reducer from './reducer';
export  { ExtensionContexts } from "../components/token-inspectors";



export const storeConfig =
{
    reducer,
    actions,
    selectors
}


export const store = createReduxStore(
    'kurage/markdown-block-editor',
    {
        ...storeConfig
    }
)

const registeredStore = register(store);

