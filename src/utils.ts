import { once } from 'events';
import * as path from 'path';

import type { VoiceChannel } from 'discord.js';

import * as config from '../config.json';

export function parseCommand(messageContent: string): string {
    return messageContent.trim().slice(config.commandPrefix.length);
}

export async function playAudioFile(targetChannel: VoiceChannel, filePath: string): Promise<void> {
    const connection = await targetChannel.join();
    try {
        const dispatcher = connection.play(path.resolve(filePath), { volume: 0.35 });
        await once(dispatcher, 'finish');
    } finally {
        if (!connection.dispatcher) connection.disconnect();
    }
}
