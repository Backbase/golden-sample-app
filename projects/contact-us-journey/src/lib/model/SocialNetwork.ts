export interface SocialNetwork {
    name: string;
    url: string;
    iconName: string;
}

export interface SocialNetworks extends Array<SocialNetwork>{ }