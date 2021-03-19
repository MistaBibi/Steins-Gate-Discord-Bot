export interface Emoji {
    filePath: string;
    description: string;
}

export interface BotCommand {
    usage: string;
    description: string;
    params: Record<string, any>;
}

export interface BotSoundCommand extends BotCommand {
    filePath: string;
}

export enum SoundCommandKey {
    TUTURU = 'tuturu',
    BEECHGA = 'beechga',
    SONUVABETCH = 'sonuvabetch',
}

export enum PlainCommandKey {
    HELP = 'help',
    GREETME = 'greetme',
}

export enum EmojiCommand {
    AMADEUS_KURISU = 'amadeus_kurisu',
}
