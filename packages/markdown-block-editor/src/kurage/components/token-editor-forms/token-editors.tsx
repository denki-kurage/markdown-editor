import { SelectControl } from "@wordpress/components"
import { codeLanguages } from "../../classes/CodeLanguages"
import { TokenEditorProps } from "../inspector-hooks"
import { useState } from "react"

export const TableTokenEditor = ({ token, contexts }: TokenEditorProps) =>
{
    return (
        <div>TABLE EDITOR</div>
    )
}

export const HeadingTokenEditor = ({}: TokenEditorProps) =>
{
    return (
        <div>HEADING EDITOR</div>
    )
}


export const CodeEditor = ({ token, contexts }: TokenEditorProps) =>
{
    const { tokenContext } = contexts;
    const { onEdits } = tokenContext;
    const languages = codeLanguages;
    const text = tokenContext.getSingleText() || '';
    const [lang, setLang] = useState(/^\s*\`\`\`(\S*)/.exec(text)?.[1] || '');
    const { start, end } = token.getPosition();

    return (
        <div>
            <SelectControl
                label="Language"
                value={lang}
                options={[
                    { label: 'Auto', value: '' },
                    ...languages.map(l => ({ label: `${l.name} (${l.label})`, value: l.name }))
                ]}
                onChange={(value) => {
                    setLang(value);
                    const lines = text.split('\n');
                    if(lines.length > 0)
                    {
                        lines[0] = '```' + value;
                        const newText = lines.join('\n');
                        onEdits([[newText, start, end]]);
                    }
                }}
                />
        </div>
    )
}

