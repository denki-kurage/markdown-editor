import { BlockControls } from "@wordpress/block-editor";
import { ToolbarButton, ToolbarDropdownMenu } from "@wordpress/components";
import { ICommand, ICommandItem } from "@mde/markdown-core";
import { useAppContext } from "../context/Markdown-app-context";
import { useMemo } from "react";
//import { DefaultCommandItems, lightIconsMap } from "@mde/markdown-core-extensions";

const toIcon = (item: ICommandItem) =>
{
	const icon = item.icon;
	return typeof icon === 'string' ? icon : (size: any) => <img width={16} height={size} src={icon} />
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
		<ToolbarButton label={item.label} text={item.icon ? undefined : item.label} icon={icon} disabled={!canExecute} onClick={cmd} />
	)
}

export const CommandToolbar = () =>
{
	const { markdownCore } = useAppContext();
	const root = useMemo(() => markdownCore.getCommandsMap(), [markdownCore]);
	const children = root?.children ?? [];

	if(!root)
	{
		return <></>
	}

	return (
		<BlockControls>
			<ToolbarDropdownMenu
				label={root.label}
				text={root.icon ? undefined : root.label}
				icon={root.icon ?? null}
				controls={ children.map(toControl) }
			/>
		</BlockControls>
	)
}

export const FlatCommandToolbar = () =>
{
	const { markdownCore } = useAppContext();
	const root = useMemo(() => markdownCore.getCommandsMap(), [markdownCore]);
	const children = root?.children ?? [];

	if(!root)
	{
		return <></>
	}

	return (
		<BlockControls>
			{ children.map(c => <CommandControl item={c} />)}
		</BlockControls>
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

