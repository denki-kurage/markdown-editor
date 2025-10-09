import { IAppContext } from "./IAppContext";


export let AppContext: IAppContext;

export function setAppContext(context: IAppContext)
{
	AppContext = context;
}




