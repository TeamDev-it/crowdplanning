import { computed, defineComponent, getCurrentInstance, onMounted, PropType, ref, watch } from "vue";
import { CommonRegistry, IProjectableModel, MessageService } from "vue-mf-module";
import datePicker from "v-calendar/lib/components/date-picker.umd";
import dateTime from "../dateTime/dateTime.vue";
import { plansService } from "@/services/plansService";
import Autocomplete from "../autocomplete/autocomplete.vue";
import { store } from "@/store";
import { groupsService } from "@/services/groupsService";
import groupButton from "@/components/groupButton/groupButton.vue";
import statusButton from "@/components/statusButton/statusButton.vue";
import { Emit } from "vue-property-decorator";

export default defineComponent({
    name: 'planWizard',
    props: {
        value: {type: Object as PropType<IProjectableModel<server.Plan>>},
    },
    components: {
        datePicker,
        dateTime,
        Autocomplete,
        groupButton,
        statusButton
    },
    setup(props, {emit}) {

        const plan = ref<server.Plan>({} as server.Plan);

        const currentUser = ref<server.Myself>()

        const steplevel = ref<number>(1)
        const workspaceId = ref<string>('');
        const plansGroupRoot = ref<server.Group>({} as server.Group);
        const featureTest = ref<locations.Feature | null>(null);
        const tasksList = ref<string[]>([])
        const context = ref<string>("PLANS");
        const isPublic = ref<boolean>(true);
        const toggleType = ref<boolean>(false);
        const disablePublishButton = ref<boolean>(false);
        
        const createPlan = ref <server.createPlan>({
            feature: featureTest.value as locations.Feature,
            plan: props.value as unknown as server.Plan,
            tasks: tasksList.value as string[]
        })

        watch(() => plan.value.isPublic, onIsPublicChanged)
        function onIsPublicChanged() {
            if (plan.value.isPublic || plan.value.isPublic == undefined) {
                plan.value.rolesCanRate = [];
                plan.value.rolesCanSeeOthersComments = [];
                plan.value.rolesCanSeeOthersRatings = [];
                plan.value.rolesCanWriteComments = [];
            }
        }

        const taskSelector = computed(() => {
            return CommonRegistry.Instance.getComponent('task-selector');
        })
        
        const mediaGallery = computed(() => {
            return CommonRegistry.Instance.getComponent('media-gallery');
        })

        const t = getCurrentInstance()!.proxy.$root.$t

        const steps = ref<{title: string, description: string, idx: number, class: string}[]>([
            { title: t('plan.wizard-first-step', 'Dettagli'), description: t('plan.wizard-first-step.description', 'Inserisci un titolo, una foto di copertina e una descrizione per il progetto'), idx: 1, class: 'one' },
            { title: t('plan.wizard-second-step', 'Geometria'), description: t('plan.wizard-second-step.description', 'Seleziona l’area geografica d’interesse'), idx: 2, class: 'two' },
            { title: t('plan.wizard-third-step', 'Condizioni'), description: t('plan.wizard-third-step.description', 'Seleziona le condizioni del progetto'), idx: 3, class: 'three' },
            { title: t('plan.wizard-fourth-step', 'Fine'), description: t('plan.wizard-fourth-step.description', 'Crezione progetto conclusa!'), idx: 4, class: 'four' }
        ])

        function closepopups() {
            MessageService.Instance.send("closepopups");
        }

        const states = computed<server.State[]>(() => {
            return Array.from(store.getters.crowdplanning.getStates(plansGroupRoot.value.id) || []);
        })

        watch(() => isPublic.value, planIsPublic)
        function planIsPublic() {
            if (isPublic.value) {
                plan.value.isPublic = true
            } else if (!isPublic.value) {
                plan.value.isPublic = false
            }
        }

        onMounted(mounted)
        async function mounted() {
            steplevel.value = 1
            currentUser.value = await MessageService.Instance.ask("WHO_AM_I");
            await getData();
            onIsPublicChanged()
        }
        
        async function getData(): Promise<void> {

            let allGroups = [];
    
            allGroups = await groupsService.getGroups();
    
            plansGroupRoot.value = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;
    
            if (plansGroupRoot.value) {
                // x.parentGroupId === this.plansGroupRoot?.id  (trova tutti i gruppi principali)
                // x.parentGroupId !== null  (trova tutti i gruppi (principali e figli))
                // x.parentGroupId !== this.plansGroupRoot?.id (trova solo gruppi figli e PLANS)
                plansGroupRoot.value.children = buildTree(allGroups.filter(x => x.parentGroupId !== null));
            }
    
            if (plansGroupRoot.value?.id) {
                await plansService.getPlans();
            }
        }

        function buildTree(objects: server.Group[]): server.Group[] {
            const tree: server.Group[] = [];
            const objectMap: { [key: string]: server.Group } = {};
    
            objects.forEach(obj => {
                objectMap[obj.id] = obj;
                obj.children = [];
            });
    
            objects.forEach(obj => {
                if (obj.parentGroupId !== null && objectMap[obj.parentGroupId]) {
                    objectMap[obj.parentGroupId].children.push(obj);
                } else {
                    tree.push(obj);
                }
            });
            return tree;
        }
    
        function close() {
            try {
                props.value?.reject();
            } catch {
                // 
            }
            props.value?.resolve(plan.value);
        }

        function getCurrentStepTitle(index: number) {
            let step = steps.value.find(s => s.idx === index)
            if (step) {
                return step.title
            }
            else {
                return null;
            }
        }
    
        function getCurrentStepDescription(index: number) {
            let step = steps.value.find(s => s.idx === index)
            if (step) {
                return step.description
            }
            else {
                return null;
            }
        }
    
        async function coverUploaded(file: server.FileAttach | server.FileAttach[]): Promise<void> {
            if (file && plan.value) {
                let cover = null;
                if (Array.isArray(file)) {
                    cover = file[0];
                } else {
                    cover = file;
                }
    
                const sharableCoverImageToken = await askForSharedFile(cover.id, plan.value.id!, `${context.value}-COVER`) as unknown as ArrayBuffer;
    
                plan.value.coverImageIds = { originalFileId: cover.id, sharedToken: decodeSharable(sharableCoverImageToken), contentType: cover.contentType } as file.SharedRef;
    
                if (plan.value.id)
                    //update plan
                    await plansService.Set(plan.value!.groupId, plan.value);
            }
        }
    
        async function askForSharedFile(fileId: string, id: string, context: string): Promise<string> {
            return await MessageService.Instance.ask("SHARE_FILE", fileId, `${context}-${id}`);
        }
    
        function decodeSharable(buffer: ArrayBuffer): string {
            const textDecoder = new TextDecoder();
    
            return textDecoder.decode(buffer);
        }
    
        async function coverRemoved(file: server.FileAttach): Promise<void> {
            if (plan.value) {
    
                plan.value.coverImageIds = null;
    
                if (plan.value.id)
                    //update plan
                    await plansService.Set(plan.value!.groupId, plan.value);
            }
        }
    
        const refs = getCurrentInstance()!.proxy.$refs;
        const coverMediaGalleryRef = ref(''); 

        async function confirm(): Promise<void> {

            disablePublishButton.value = true
            // this.value.resolve(this.plan)
    
            if (plan.value && !plan.value?.id) {
                // Save new plan
                plan.value.id = null;
                plan.value = await plansService.Set(plan.value.groupId, plan.value) as server.Plan;
            }
    
            if (!plan.value) {
                MessageService.Instance.send("ERROR", t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
                return;
            }
    
            disablePublishButton.value = false
    
            // Non navigo il dizionario perche' devo navigare solo i componenti con ref delle immagini
            // await (this.$refs[this.coverMediaGalleryRef] as any)?.save(this.plan.id);
            await (refs[coverMediaGalleryRef.value] as unknown as { save(id: string): Promise<void> })?.save(plan.value.id as string);
    
            // await (this.$refs[this.mediaGalleryRef] as any)?.save(this.plan.id);
    
            // Update plan with new properties
            await plansService.Set(plan.value!.groupId, plan.value);
    
            if (plan.value.planType == 'fromIssues' && tasksList.value) {
                MessageService.Instance.ask("CHANGE_TASKS_REFERENCE", tasksList.value, plan.value.id);
            }
            if (plan.value.planType == null) {
                plan.value.planType = 'simple';
            }
    
            plan.value.isPublic = isPublic.value;
            setPlan(plan.value);
    
            close();
    
            MessageService.Instance.send("OPEN_CROWDPLAN", plan.value.id);
        }
    
        function setPlan(plan: server.Plan): void {
            store.actions.crowdplanning.setPlan(plan);
        }
        function groupChanged(val: server.Group) {
            plan.value!.group = val;
            plan.value!.groupId = val.id;
          }
      
          function stateChanged(val: string) {
            plan.value!.state = val;
          }
    
        watch(() => toggleType.value, ToggleType)
        function ToggleType() {
            if (toggleType.value) {
                plan.value.planType = 'fromIssues';
            } else {
                plan.value.planType = 'simple';
                tasksList.value = []
            }
        }
    
        return {
            plan,
            currentUser,
            steplevel,
            featureTest,
            workspaceId,
            plansGroupRoot,
            createPlan,
            taskSelector,
            mediaGallery,
            context,
            isPublic,
            states,
            steps,
            toggleType,
            disablePublishButton,
            tasksList,
            closepopups,
            close,
            getCurrentStepTitle,
            getCurrentStepDescription,
            coverUploaded,
            coverRemoved,
            confirm,
            groupChanged,
            stateChanged,
        }
    }
})