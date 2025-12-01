import { createReduxStore, dispatch, register, select } from "@wordpress/data";
import * as selectors from './selectors'
import * as actions from './actions'
import * as resolvers from './resolvers';

import reducer from './reducer';


export const storeConfig =
{
    reducer,
    actions,
    selectors,
    resolvers
}


export const store = createReduxStore(
    'kurage/markdown-block-editor',
    {
        ...storeConfig
    }
)

const registeredStore = register(store);

