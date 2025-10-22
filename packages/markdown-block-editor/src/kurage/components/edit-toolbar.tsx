import { BlockControls } from "@wordpress/block-editor";
import { ToolbarButton, ToolbarDropdownMenu, ToolbarGroup } from "@wordpress/components";
import { ICommand, ICommandItem } from "@mde/markdown-core";
import { useAppContext } from "../context/markdown-app-context";
import { useMemo } from "react";
//import { DefaultCommandItems, lightIconsMap } from "@mde/markdown-core-extensions";

const toIcon = (item: ICommandItem) =>
{
	console.log(item)
	const icon = item.icon;
	return (size: any) => <img width={16} height={size} src={icon} />
}

const toAction = (item: ICommandItem, p?: any) =>
{
	return [
		() => item.command?.execute(p),
		item.command?.canExecute(p)
	] as [() => void, boolean]
}

const toControl = (item: ICommandItem) =>
{
	return ({
		title: item.label,
		icon: toIcon(item),
		isDisabled: false,
		onclick: () => {}
	}) as any
}

export const CommandControl = ({ item }: { item: ICommandItem }) =>
{
	const [cmd, canExecute] = toAction(item);
	const icon = toIcon(item) as any;
	return (
		<ToolbarButton
			label=""
			text=""
			icon={icon}
			disabled={!canExecute}
			onClick={cmd}
			/>
	)
}

export type CommandToolbarProps =
{
	root: ICommandItem;
}
export const CommandToolbar = ({ root }: CommandToolbarProps) =>
{
	const children = root?.children ?? [];

	if(!root)
	{
		return <></>
	}

	return (
		<ToolbarDropdownMenu
			label={root.label}
			text={root.icon ? undefined : root.label}
			icon={root.icon ?? null}
			controls={ children.map(toControl) }
		/>
	)
}

export type FlatCommandToolbarProps =
{
	root: ICommandItem;
}
export const FlatCommandToolbar = ({ root }: FlatCommandToolbarProps) =>
{
	const children = root?.children ?? [];

	if(!root)
	{
		return <></>
	}

	return (
		<ToolbarGroup>
			{ children.map(c => <CommandControl item={c} />)}
		</ToolbarGroup>
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

