export interface MediaData {
    // common property
    title?: string;
    img?: string;
    preview?: string;
}

export enum MediaType {
    Twitter =  'twitter.com',
    Medium = 'medium.com',
    Youtube = 'youtube.com'
}
