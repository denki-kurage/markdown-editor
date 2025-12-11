import { useDispatch, useSelect } from "@wordpress/data";
import { store } from "../store";
import { useMarkdownAppContext } from "../context/markdown-app-context";
import { SelectControl, Spinner } from "@wordpress/components";
import { OthreSettings } from "./OtherSettings";

const fontFamilies = ['BIZ UDゴシック', 'Consolas'].map(x => ({label: x, value: x}));
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

    return (
        <>
            <p>{storeState.isLoading ? <><Spinner />設定の更新中！</> : faultMsg || '設定' }</p>

            <SelectControl
                label="Font Family"
                options={fontFamilies}
                value={fontFamily}
                onChange={fontFamily => updateSettings({ fontFamily })}
                />
            
            <SelectControl
                label="Font Size"
                options={fontSizes}
                value={(fontSize || 12).toString()}
                onChange={e => updateSettings({ fontSize: parseInt(e) })} />

            <OthreSettings />
            
        </>
    )
}



