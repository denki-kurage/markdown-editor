import { ICommand } from "../component-model";
export interface ICommandItem {
    name: string;
    label: string;
    command: ICommand | undefined;
    icon: any;
    children?: ICommandItem[];
}
//# sourceMappingURL=ICommandItem.d.ts.map