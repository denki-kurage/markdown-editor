import { ToolbarButton, ToolbarDropdownMenu, ToolbarGroup } from "@wordpress/components";
import { ICommandItem } from "@mde/markdown-core";
import { useCallback, useEffect, useMemo } from "react";
import { useMarkdownTokenContext } from "../context/markdown-token-context";

//import { DefaultCommandItems, lightIconsMap } from "@mde/markdown-core-extensions";

const toIcon = (item: ICommandItem) =>
{
	const icon = item.icon;
	return (size: any) => <img width={16} height={size} src={icon} />
}


export type CommandToolbarProps =
{
	root: ICommandItem;
}
export const CommandToolbar = ({ root }: CommandToolbarProps) =>
{
	const { selections } = useMarkdownTokenContext();
	const icon = useMemo(() => root?.icon ? toIcon(root) : null, [root])
	const controls = useMemo(() => (root?.children ?? []).filter(c => !!c.icon).map(toControl), [root]);

	controls.map(c => c.isDisabled = !c.item.command?.canExecute())

	if(!root)
	{
		return null;
	}

	if(!icon)
	{
		return <FlatCommandToolbar root={root} />
	}
	
	return (
		<ToolbarDropdownMenu
			label={root.label}
			icon={icon}
			controls={ controls }
		/>
	)
}

const toControl = (item: ICommandItem) =>
{
	return ({
		item,
		title: item.label,
		icon: toIcon(item),
		isDisabled: !item.command?.canExecute(),
		onClick: () => item.command?.execute(),
	}) as any
}





export type FlatCommandToolbarProps =
{
	root: ICommandItem;
}
export const FlatCommandToolbar = ({ root }: FlatCommandToolbarProps) =>
{
	const { selections } = useMarkdownTokenContext();
	const items = (root.children ?? []).filter(c => !!c.icon).map(c => <CommandControl item={c} />)

	if(!root)
	{
		return null;
	}

	return (
		<ToolbarGroup>
			{ items }
		</ToolbarGroup>
	)
}

export const CommandControl = ({ item }: { item: ICommandItem }) =>
{
	const canExecuteResult = item.command?.canExecute();
	const cmd = useCallback(() => item.command?.execute(), []);
	const icon = useMemo(() => toIcon(item) as any, [item]);

	return (
		<ToolbarButton
			label={item.label}
			text=""
			icon={icon}
			disabled={!canExecuteResult}
			onClick={cmd}
			/>
	)
}


/*
type CommandKeyMap = typeof DefaultCommandItems;
type EditParam = {map: CommandKeyMap, commandMap: Map<string, ICommand>, isEnable: (name: string) => boolean}
export const EditToolbar = ({ map, commandMap, isEnable }: EditParam ) =>
{
	return (
		<BlockControls>
		{
			[...Object.entries(map)].map(([category, commandNames]) => {
				return (
					<ToolbarDropdownMenu
						label={category}
						text={category}
						icon={null}
						controls={
							commandNames.map( cmdName => {
								const cn = `${category}:${cmdName}`;
								const icon = lightIconsMap.get(cn);
								const execCmd = commandMap.get(cn)
								const action = () => execCmd?.execute();
								const isDisabled = !isEnable(cn);
								return {
									title: cmdName,
									icon: (size: any) => <img width={16} height={size} src={icon?.default} />,
									isDisabled,
									onClick: action
								}
							})
						}
						/>
				)
			})
		}
		</BlockControls>
	)
}

export default EditToolbar;
*/

