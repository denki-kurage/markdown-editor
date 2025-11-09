import { Spinner } from "@wordpress/components";
import React from "react";

export const Loading = ({isLoading}: any) =>
{
    const style: any = {
        position: 'absolute',
        top: 0,
        width: "100%",
        height: "100%",
    };

    return (
        <>
            { isLoading &&
                <>
                <div style={{...style, opacity: 0.5, backgroundColor: "white"}}></div>
                <div style={{...style, alignContent: "center", textAlign: "center"}}>
                    <Spinner style={{width: 100, height: 100}} />
                </div>
                </>
            }
        </>
    )
}

export const LoadingPanel = React.memo(({isLoading, children}: {isLoading: boolean, children: any}) =>
{
    return (
        <div style={{position: 'relative'}}>
            { children }
            <Loading isLoading={isLoading} />
        </div>        
    )
});

