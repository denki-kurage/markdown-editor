export type ISettings =
{
    fontSize: number;
    fontFamily: string;
    frontTheme: string;
    adminTheme: string;
    prismTheme: string;
    monacoTheme: string;
    previewInterval: number;
    configurations: {[key: string]: any}
}
