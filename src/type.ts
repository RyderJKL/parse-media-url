export interface MediaData {
    title: string;
    voteCount: string;
    pwCount: string;
}

export enum MediaType {
    Twritter =  'twritter',
    Medium = 'medium.com',
    Youtube = 'youtube'
}

export const mediaTypeArr = Object.keys(MediaType).map(key => MediaType[key]);