
import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { CommonRegistry, IProjectableModel, MessageService } from "vue-mf-module";
import { plansService } from "@/services/plansService";

type taskType = {
    id: number;
    hexId: string;
    parentId: string;
    parentType: string;
    title: string;
    description: string;
    priority: number;
    state: any;
    isArchived: boolean;
    source: string;
    startDate: Date;
    dueDate: Date;
    userName: string;
    creationDate: Date;
    lastUpdated: Date;
    groupId: string;
    group: any;
    assignedTo: any;
    location?: locations.Location;
    workspaceId?: string;
    customFields: [];
    subtaskCount?: {
        type: string;
        count: number;
    }[];
    isClusterRoot: boolean;
    tags: string[];
    shortId: number;
};

export default defineComponent({
    name: "taskSelectorModal",
    props: {
        value : {
            type : Object as PropType<IProjectableModel<server.Plan>>,
        }
    },
    setup(props, { emit }) {

        const tasksList = ref<string[]>([])

        const taskSelector = computed(() => {
            return CommonRegistry.Instance.getComponent('task-selector');
        })

        onMounted(mounted)
        function mounted() {
            getPlanTasks()
        }

        async function getPlanTasks() {
            let groups = await MessageService.Instance.ask<server.Group[]>('GET_TASKS_GROUPS')
            let tasks = await Promise.all(groups.map(g => MessageService.Instance.ask<taskType[]>('GET_TASKS_BY_GROUP', g.id, this.value?.data.id)));
            tasksList.value = tasks.map(tasks => tasks.map(t => t.id)).flat() as unknown as string[];
        }

        function close() {
            props.value?.resolve(props.value.data)
        }
    
        async function confirm() {
            // await plansService.importTask(this.value.data.id!, this.tasksList!);
            await MessageService.Instance.ask("CHANGE_TASKS_REFERENCE", tasksList.value!, props.value?.data.id!)
            props.value?.resolve(props.value?.data)
        }

        return {
            tasksList,
            taskSelector,
            getPlanTasks,
            close,
            confirm
        }
    }
})