import { useMemo } from "react";
import EditToolbar from "../edit-toolbar";
import TableInspectors from "./table-inspectors";


//import { DefaultCommandItems, Markdown, MarkdownTableContent } from "md-table-editor";
//import { useMarkdownContext } from "../../context/markdown-context";

export const Table = () =>
{
    return <h2>TABLE</h2>
    /*
    const { markdownApp, currentTable, tables } = useMarkdownContext();
    const helper = useMemo(() => markdownApp ? new AppMainHelper(markdownApp) : undefined, [markdownApp]);
    const enabledCommandNames = helper?.enabledCommandNames ?? [];
    
    return (
        <div className="kurage-table">
            <p>Table component is not implemented yet.</p>

            { (helper && currentTable) && 
                <EditToolbar
                    map={DefaultCommandItems}
                    commandMap={helper.commands}
                    isEnable={c => enabledCommandNames.includes(c)}
                    />
            }

            { helper &&
                <TableInspectors
                    map={DefaultCommandItems}
                    commandMap={helper.commands}
                    isEnable={c => enabledCommandNames.includes(c)}
                    tables={tables}
                    current={currentTable}
                    />
            }
            
        </div>
    );
    */
}