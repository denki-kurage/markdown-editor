

export class MarkdownEscapeHelper
{

    public static readonly ESCAPE_CHARACTERS = ['\\', '[', ']', '(', ')', '"', "'", '&', '<', '>'];
    
    public static escapeKeywords(text: string, keywords: string[]): string
    {
        const pattern = new RegExp(`([${keywords.map(k => '\\' + k).join('')}])`, 'g');
        return text.replace(pattern, '\\$1');
    }

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
