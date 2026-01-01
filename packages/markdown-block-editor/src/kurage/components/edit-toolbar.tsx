import { ToolbarButton, ToolbarDropdownMenu, ToolbarGroup } from "@wordpress/components";
import { ICommandItem } from "@kurage/markdown-core";
import { useCallback, useEffect, useMemo } from "@wordpress/element";
import { useMarkdownTokenContext } from "../context/markdown-token-context";

//import { DefaultCommandItems, lightIconsMap } from "@kurage/markdown-core-extensions";

const toIcon = (item: ICommandItem) =>
{
	const icon = item.icon;
	return (size: any) => <img width={16} height={size} src={icon} />
}


export type CommandToolbarProps =
{
	groupRoot: ICommandItem;
}
export const CommandToolbarGroup = ({ groupRoot }: CommandToolbarProps) =>
{

	const groupChildren = groupRoot.children ?? [];
	const buttons = groupChildren.map(item => {
		if(item.children?.length)
		{
			const controls = item.children.map(toControl);
			controls.map(c => c.isDisabled = !c.item.command?.canExecute());
			return <ToolbarDropdownMenu label={item.label} icon={toIcon(item)} controls={controls} />
		}
		else
		{
			return item.icon ? <CommandControl item={item} /> : undefined;
		}
	}).filter(item => !!item)

	return (
		<ToolbarGroup>
			{ buttons }
		</ToolbarGroup>
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

