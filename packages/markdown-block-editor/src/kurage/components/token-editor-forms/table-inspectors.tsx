import { InspectorControls } from "@wordpress/block-editor";
import { Button, PanelBody, RangeControl, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { DefaultCommandItems, lightIconsMap, MarkdownTableContent } from "@mde/markdown-core-extensions";
import { __ } from "@wordpress/i18n";
import { ICommand } from "@mde/markdown-core";

const iconDisabled = '.components-button[aria-disabled=true]{ opacity: 0.3; }';

type CommandKeyMap = typeof DefaultCommandItems;
type EditParam = {map: CommandKeyMap, commandMap: Map<string, ICommand>, isEnable: (name: string) => boolean}
type InspectorEditParam = { tables: Array<MarkdownTableContent>, current?: MarkdownTableContent } & EditParam;
export const TableInspectors = ({ map, commandMap, tables, current, isEnable }: InspectorEditParam) =>
{
    const scrollCommand = commandMap.get('scroll');

    return (
        <InspectorControls>
            
            <PanelBody title="table scroll">
                <div className="scroll-commands-panel">
                    { tables.map((table, index) => <TableView table={table} index={index} command={scrollCommand} />)}
                </div>
            </PanelBody>

            <PanelBody title="Commands">
                <style type="text/css">{iconDisabled}</style>

                <div>
                {
                    current && [...Object.entries(map)].map(([category, commandNames]) => {
                        return (
                            <>
                                <p>{category}</p>
                                <ToolbarGroup>
                                    {
                                    commandNames.map( cmdName => {
                                        const cn = `${category}:${cmdName}`
                                        const icon = lightIconsMap.get(cn);
                                        const execCmd = commandMap.get(cn)
                                        const action = () => execCmd?.execute();

                                        return <ToolbarButton
                                            title={cmdName}
                                            label={cn}
                                            icon={(size: any) => <img width={16} height={size} src={icon?.default} />}
                                            disabled={!isEnable(cn)}
                                            onClick={action}
                                            />
                                    })
                                    }
                                </ToolbarGroup>
                            </>
                        )
                    })
                }
                </div>
            </PanelBody>


        </InspectorControls>
    )
}

export const TableView = ({table, command, index}: {table: MarkdownTableContent, command?: ICommand, index: number}) =>
{
    const label = table.headers.cells.map(h => h.word).join(', ')
    const onClick = () =>
    {
        command?.execute(index);
    }

    return (
        <Button variant="secondary" className="scroll-command-item" onClick={() => onClick()}>{ label }</Button>
    )
}

export default TableInspectors;