import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { Button, Flex, FlexItem, SelectControl, Spinner, TextControl } from "@wordpress/components";
import { OthreSettings } from "./OtherSettings";
import { __ } from "@wordpress/i18n";
import { useState } from "react";

const fontFamilies = [
    { label: '', value: '' },
    ...['Consolas', 'Courier New', 'Inconsolata', 'Monaco', 'Cascadia Code', 'Meiryo UI', 'MS ゴシック', 'BIZ UDゴシック', 'Noto Sans CJK SC/TC', 'Microsoft JhengHei', 'Malgun Gothic'].map(x => ({label: x, value: x}))
];
const fontSizes = [...Array(30).keys()].map(x => (x + 4).toString()).map(x => ({label: x, value: x}))

export const EditorSettings = ({}) =>
{
    const { settings, storeState } = useSelect(select => {
        const s = select(store);
        const settings = s.getSettings();
        const storeState = s.getStoreState();
        return { settings, storeState }
    }, []);

    const { updateSettings } = useDispatch(store);
    const faultMsg = storeState.faultMessage ?? '';
    const { fontSize, fontFamily } = settings;
    const [ff, setFf] = useState(fontFamily);

    const changeFontFamily = (ff?: string|null) =>
    {
        const f = ff || '';
        setFf(f);
        updateSettings({ fontFamily: f })
    }

    return (
        <>
            <p>{storeState.isLoading ? <><Spinner />{__('Updating settings...', 'markdown-block-editor')}</> : faultMsg || __('Settings', 'markdown-block-editor') }</p>

            <SelectControl
                label={__('Font Family', 'markdown-block-editor')}
                options={fontFamilies}
                value={fontFamily}
                onChange={changeFontFamily}
                />
            
            <InputBox
                text="OK2"
                value={ff}
                onChanged={setFf}
                onClicked={() => updateSettings({ fontFamily: ff })} />

            
            <SelectControl
                label={__('Font Size', 'markdown-block-editor')}
                options={fontSizes}
                value={(fontSize || 12).toString()}
                onChange={e => updateSettings({ fontSize: parseInt(e) })} />

            <OthreSettings />
            
        </>
    )
}


type InputBoxProps =
{
    text: string;
    value: string;
    onChanged: (value: string) => void;
    onClicked: () => void;
}

const InputBox = ({text, value, onChanged, onClicked}: InputBoxProps) =>
{
    return (
        <Flex gap="1" align="center">
            <FlexItem isBlock>
                <TextControl
                    __nextHasNoMarginBottom
                    value={ value }
                    onChange={onChanged}
                />
            </FlexItem>
            <FlexItem>
                <Button
                    variant="primary"
                    onClick={onClicked}
                    size="compact"
                >
                    { text }
                </Button>
            </FlexItem>
        </Flex>
    );
}


