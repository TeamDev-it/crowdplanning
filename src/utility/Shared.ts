import { Buffer } from 'buffer';
import { MessageService } from 'vue-mf-module';

export class Shared {
    public static imageFromString(shared: string): string {
        const buffer = Buffer.from(shared);
        
        return 'data:image/png;base64,' + buffer.toString('base64');
    }

    public static async getShared(token: string): Promise<string> {
        return await MessageService.Instance.ask("GET_SHARED", token);
    }
}