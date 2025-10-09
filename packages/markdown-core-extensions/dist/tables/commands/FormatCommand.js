import { FormatCommandBase } from "./CommandBaseClasses";
export class FormatCommand extends FormatCommandBase {
    canExecuteOverride(cellInfo, parameter) {
        return true;
    }
    executeOverride(cellInfo, parameter, focus) {
        const rp = cellInfo.relativeCursorInnerPosition;
        focus.format();
        const cp = cellInfo.newCellInfo(rp);
        const f = cp?.getForcus();
        focus.setFocusedCellInfo(f);
    }
    put(cp, tag) {
        if (cp) {
            const pos = this.commandContext.appContext.getEditorModel().getCursor() || {
                docIndex: -1,
                charIndex: -1
            };
            const tx = `wordPos=${cp.wordInnerPosition}, cursor(${pos.docIndex}, ${pos.charIndex})`;
            const line = `|${cp.row.cells.map(_ => _.word).join('|')}|`;
            //console.log(`${line} [${tag}]relPos = ${cp.relativeCursorInnerPosition}, fcs(${cp.docPosition.docIndex}, ${cp.docPosition.charIndex}) ... tx(${tx}), ${ cp.serial }`);
        }
        else {
            //console.log(`undefined [${tag}]`);
        }
    }
}
//# sourceMappingURL=FormatCommand.js.map