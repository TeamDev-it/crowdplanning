import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { CommonRegistry, IProjectableModel, MessageService } from "vue-mf-module";
import datePicker from "v-calendar/lib/components/date-picker.umd";
import dateTime from "../dateTime/dateTime.vue";
import { plansService } from "@/services/plansService";
import { CONFIGURATION } from "@/configuration";
import Autocomplete from "../autocomplete/autocomplete.vue";
import { store } from "@/store";
import { groupsService } from "@/services/groupsService";


@Component({
    components: {
        datePicker,
        dateTime,
        Autocomplete,
    }
})
export default class PlanWizard extends Vue {

    public readonly coverMediaGalleryRef: string = 'cover-media-gallery';
    public readonly mediaGalleryRef: string = 'media-gallery';

    @Prop()
    value!: IProjectableModel<server.Plan>;



    currentUser!: server.Myself | null

    steplevel: number = 1
    workspaceId = "";
    plansGroupRoot: server.Group = {} as server.Group;
    featureTest?: locations.Feature;

    createPlan: server.createPlan = {
        feature: this.featureTest as locations.Feature,
        plan: this.value as unknown as server.Plan,
        tasks: this.tasksList as string[]
    }

    tasksList?: string[]

    get taskSelector() {
        return CommonRegistry.Instance.getComponent('task-selector');
    }

    get mediaGallery() {
        return CommonRegistry.Instance.getComponent('media-gallery');
    }

    get context(): string {
        return CONFIGURATION.context;
    }

    async mounted() {
        this.steplevel = 1
        this.currentUser = await MessageService.Instance.ask("WHO_AM_I");
        await this.getData();

        // if (this.newPlan) {
        //     this.plan = this.newPlan
        // }
    }

    private async getData(): Promise<void> {

        let allGroups = [];
        if (this.currentUser) {
            allGroups = await groupsService.getGroups();
        } else {
            allGroups = await groupsService.getPublicGroups(this.workspaceId);
        }

        this.plansGroupRoot = allGroups.find(x => !x.parentGroupId) ?? {} as server.Group;

        if (this.plansGroupRoot) {
            this.plansGroupRoot.children = allGroups.filter(x => x.parentGroupId === this.plansGroupRoot?.id);
        }

        if (this.plansGroupRoot?.id) {
            if (this.currentUser) {
                await plansService.getPlans();
            } else {
                await plansService.getPublicPlans(this.workspaceId);
            }
        }
    }

    close() {
        try {
            this.value?.reject();
        } catch {
            // 
        }

        this.value.resolve(this.value.data);
    }


    steps = [
        { title: this.$t('plan.wizard-first-step', 'Dettagli'), description: this.$t('plan.wizard-first-step.description', 'Inserisci un titolo, una foto di copertina e una descrizione per il progetto'), idx: 1, class: 'one' },
        { title: this.$t('plan.wizard-second-step', 'Geometria'), description: this.$t('plan.wizard-second-step.description', 'Seleziona l’area geografica d’interesse'), idx: 2, class: 'two' },
        { title: this.$t('plan.wizard-third-step', 'Condizioni'), description: this.$t('plan.wizard-third-step.description', 'Seleziona le condizioni del progetto'), idx: 3, class: 'three' },
        { title: this.$t('plan.wizard-fourth-step', 'Fine'), description: this.$t('plan.wizard-fourth-step.description', 'Crezione progetto conclusa!'), idx: 4, class: 'four' }
    ]

    getCurrentStepTitle(index: number) {
        let step = this.steps.find(s => s.idx === index)
        if (step) {
            return step.title
        }
        else {
            return null;
        }
    }

    getCurrentStepDescription(index: number) {
        let step = this.steps.find(s => s.idx === index)
        if (step) {
            return step.description
        }
        else {
            return null;
        }
    }

    async coverUploaded(file: server.FileAttach | server.FileAttach[]): Promise<void> {
        if (file && this.value.data) {
            let cover = null;
            if (Array.isArray(file)) {
                cover = file[0];
            } else {
                cover = file;
            }

            const sharableCoverImageToken = await this.askForSharedFile(cover.id, this.value.data.id!, `${CONFIGURATION.context}-COVER`) as unknown as ArrayBuffer;

            this.value.data.coverImageIds = { originalFileId: cover.id, sharedToken: this.decodeSharable(sharableCoverImageToken), contentType: cover.contentType } as file.SharedRef;

            if (this.value.data.id)
                //update plan
                await plansService.Set(this.value.data!.groupId, this.value.data);
        }
    }

    private async askForSharedFile(fileId: string, id: string, context: string): Promise<string> {
        return await MessageService.Instance.ask("SHARE_FILE", fileId, `${context}-${id}`);
    }

    private decodeSharable(buffer: ArrayBuffer): string {
        const textDecoder = new TextDecoder();

        return textDecoder.decode(buffer);
    }

    async coverRemoved(file: server.FileAttach): Promise<void> {
        if (this.value.data) {

            this.value.data.coverImageIds = null;

            if (this.value.data.id)
                //update plan
                await plansService.Set(this.value.data!.groupId, this.value.data);
        }
    }

    disablePublishButton: boolean = false
    async confirm(): Promise<void> {

        this.disablePublishButton = true
        // this.value.resolve(this.value.data)

        if (!this.requiredFieldsSatisfied()) {
            return;
        }

        if (this.value.data && !this.value.data?.id) {
            //   this.value.data.workspaceId = this.value.data.workspaceId;
            // Save new plan
            this.value.data.id = null;
            this.value.data = await plansService.Set(this.value.data.groupId, this.value.data) as server.Plan;
        }

        if (!this.value.data) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.error-plans-creation', 'Errore durante la creazione del progetto'));
            return;
        }

        this.disablePublishButton = false

        // Non navigo il dizionario perche' devo navigare solo i componenti con ref delle immagini
        await (this.$refs[this.coverMediaGalleryRef] as any)?.save(this.value.data.id);

        // await (this.$refs[this.mediaGalleryRef] as any)?.save(this.plan.id);

        // Update plan with new properties
        await plansService.Set(this.value.data!.groupId, this.value.data);

        if (this.tasksList != null) {
            await plansService.importTask(this.value.data.id!, this.tasksList!);
        }

        this.setPlan(this.value.data);

        this.close();
    }

    private setPlan(plan: server.Plan): void {
        store.actions.crowdplanning.setPlan(plan);
    }

    private requiredFieldsSatisfied(): boolean {
        if (!this.value.data?.title || this.value.data.title == "") {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.title_error', 'Inserisci un titolo'))
            return false;
        }
        if (!this.value.data?.groupId || this.value.data.groupId == "") {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.group_error', 'Inserisci una categoria'))
            return false;
        }
        if (!this.value.data?.description || this.value.data.description == "") {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.description_error', 'Inserisci una descrizione'))
            return false;
        }
        if (!this.featureTest || this.featureTest == undefined) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.position_error', 'Inserisci una geometria valida'));
            return false;
        }
        if (!this.value.data?.startDate || this.value.data.startDate == undefined) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.start_date_error', 'Inserisci una data di inizio'));
            return false;
        }
        // if (!this.value.data?.dueDate || this.value.data.dueDate == undefined) {
        //     MessageService.Instance.send("ERROR", this.$t('plans.modal.due_date_error', 'Inserisci una data di fine'));
        //     return false;
        // }
        if (this.value.data.planType == 'fromIssues') {
            if (this.tasksList && this.tasksList.length == 0) {
                MessageService.Instance.send("ERROR", this.$t('plans.modal.planType_error', 'Inserisci almeno una segnalazione'));
                return false;
            }
        }

        //deve stare giu
        let titleLength = this.value.data?.title.length as number
        if (titleLength > 106) {
            MessageService.Instance.send("ERROR", this.$t('plans.modal.title.length_error', 'Titolo troppo lungo'))
            return false;
        }

        return true;
    }

    goNext() {
        if (this.steplevel == 1) {
            if (!this.value.data?.title || this.value.data.title == "") {
                MessageService.Instance.send("ERROR", this.$t('plans.modal.title_error', 'Inserisci un titolo'))
                return false;
            }
            if (this.value.data.title.charAt(0) == ' ') {
                MessageService.Instance.send("ERROR", this.$t('plans.modal.title_error2', 'La prima lettera del titolo non può essere uno spazio vuoto'))
                return false;
            }
            let titleLength = this.value.data?.title.length as number
            if (titleLength > 106) {
                MessageService.Instance.send("ERROR", this.$t('plans.modal.title.length_error', 'Titolo troppo lungo'))
                return false;
            }
            if (!this.value.data?.groupId || this.value.data.groupId == "") {
                MessageService.Instance.send("ERROR", this.$t('plans.modal.group_error', 'Inserisci una categoria'))
                return false;
            }
            if (!this.value.data?.description || this.value.data.description == "") {
                MessageService.Instance.send("ERROR", this.$t('plans.modal.description_error', 'Inserisci una descrizione'))
                return false;
            }

            return this.steplevel++
        }

        if (this.steplevel == 2) {
            if (!this.featureTest || this.featureTest == undefined) {
                MessageService.Instance.send("ERROR", this.$t('plans.modal.position_error', 'Inserisci una geometria valida'));
                return false;
            }

            return this.steplevel++
        }

        if (this.steplevel == 3) {
            if (!this.value.data?.startDate || this.value.data.startDate == undefined) {
                MessageService.Instance.send("ERROR", this.$t('plans.modal.start_date_error', 'Inserisci una data di inizio'));
                return false;
            }
            if (this.value.data.planType == 'fromIssues') {
                if (this.tasksList && this.tasksList.length == 0) {
                    MessageService.Instance.send("ERROR", this.$t('plans.modal.planType_error', 'Inserisci almeno una segnalazione'));
                    return false;
                }
            }

            return this.steplevel++
        }
    }
}