import { Emoji, BotCommand, BotSoundCommand, PlainCommandKey, SoundCommandKey } from './src/types';

type PlainCommands = { [K in PlainCommandKey]: BotCommand };
type SoundCommands = { [K in SoundCommandKey]: BotSoundCommand };

declare const value: {
    commandPrefix: string;
    commands: PlainCommands & SoundCommands;
    emojiPrefix: string;
    emojis: { [K: string]: Emoji };
};

export = value;
