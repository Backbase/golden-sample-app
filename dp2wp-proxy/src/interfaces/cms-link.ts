export interface Link {
    ["href"]: string;
    ["embeddable"]?: boolean;
    ["count"]?: number;
    ["taxonomy"]: 'category' | 'post' | 'wp';
}