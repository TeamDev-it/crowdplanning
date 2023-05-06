import Vue from 'vue';

declare module "vue/types/vue" {
    interface Vue {
        $t(key: string, defaultString?: string): string;
        $can(key: string): boolean;
        $me(): server.Myself;
    }
}