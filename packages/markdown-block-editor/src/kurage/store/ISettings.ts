export type ISettings =
{
    fontSize: number;
    fontFamily: string;
    frontTheme: string;
    adminTheme: string;
    prismTheme: string;
    monacoTheme: string;
    useSnippets: boolean;
    previewInterval: number;
    configurations: {[key: string]: any}
}
