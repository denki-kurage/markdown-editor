

export class MarkdownEscapeHelper
{
    
    public static escapeMarkdownText(text: string): string
    {
        return text.replace(/([\\\[\]])/g, '\\$1');
    }

    public static escapeMarkdownLinkText(text: string): string
    {
        return text.replace(/([\(\)\\])/g, '\\$1');
    }

    public static escapeHtmlAttributeText(text: string): string
    {
        return text.replace(/(["'&<>])/g, (match) => {
            switch(match)
            {
                case '"': return '&quot;';
                case "'": return '&#39;';
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                default: return match;
            }
        });
    }

    public static escapeHtmlText(text: string): string
    {
        return text.replace(/([&<>])/g, (match) => {
            switch(match)
            {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                default: return match;
            }
        });
    }
}
