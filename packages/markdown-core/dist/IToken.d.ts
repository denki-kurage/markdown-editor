import { TokenPosition } from './TokenPosition';
export interface IToken {
    getPosition(): TokenPosition;
    getData(): any;
    getType(): string;
    getParent(): IToken | undefined;
    getChildren(): IToken[];
}
//# sourceMappingURL=IToken.d.ts.map