export class Icon {
    static getIconCode(iconCode: string): string {
        if (!iconCode) return '';

        return `ti ti-${iconCode}`;
    }
}