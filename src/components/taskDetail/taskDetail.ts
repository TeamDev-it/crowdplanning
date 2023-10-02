import Component from "vue-class-component";
import Vue from 'vue';
import { Prop } from "vue-property-decorator";
import TaskCard from "../tasks/taskCard/taskCard.vue";
import TaskSummary from "../taskSummary/taskSummary.vue";
import CitizenInteraction from "../citizenInteraction/citizenInteraction.vue";
import { store } from "@/store";
import { CONFIGURATION } from "@/configuration";
import { CommonRegistry, MessageService, Projector } from "vue-mf-module";
import PlanModal from "../planModal/planModal.vue";
import { plansService } from "@/services/plansService";
import { documentContentTypes, imagesContentTypes } from "@/@types/inputFileTypes";
import ChildrenPlans from "../childrenPlans/childrenPlans.vue";
import TaskMap from "../taskMap/taskMap.vue";


@Component({
    components: {
        TaskCard,
        TaskSummary,
        CitizenInteraction,
        ChildrenPlans,
        TaskMap
    }
})
export default class TaskDetail extends Vue {

@Prop({required: true})
selectedPlan!: server.Plan | null;




    liked: boolean = false
    count: number = 0
    addLike() {
        let l = this.liked
        this.liked = !l           
        
        if(l == false) {
            this.count++
        }

        if(l == true) {
            this.count--
        }

        
    }

    // mounted() {
    //     console.log(this.selectedPlan)
    // }

    commentSectionOpened = false;

     get plan() {
         return this.selectedPlan!.id;
     }

    get sharedPreviewComponent() {
        return CommonRegistry.Instance.getComponent('shared-preview');
    }

    get type(): string {
        return CONFIGURATION.context;
    }

     //get children(): server.Plan[] {
     //    return this.selectedPlan!.attachmentsIds;
     //}

    get selectedPlanTitle(): string {
        return this.selectedPlan!.title
    }

  

    // get states(): server.State[] {
        // return store.getters.crowdplanning.getStates(store.getters.crowdplanning.getRootGroup()?.id!);
    // }

    // get rootGroup(): server.Group{
        // return store.getters.crowdplanning.getRootGroup();
    // }

    // clearTask(): void {
    //     store.actions.crowdplanning.setSelectedPlanId(null);
    // }

    // get groups() {
        // return store.getters.crowdplanning.getGroups;
    // }

    get mediaGallery() {
        return CommonRegistry.Instance.getComponent('public-media-gallery');
    }

    get discussionRoom() {
        return CommonRegistry.Instance.getComponent('discussion-room-crowd')
    }

    get workspaceId() {
        return this.selectedPlan!.workspaceId
    }

    // async remove(): Promise<void> {
    //     try {
    //         await plansService.deleteTask(this.task.id);

    //         this.clearTask();
    //     } catch (err) {
    //         MessageService.Instance.send('ERROR', this.$t("plans.crowdplanning.plan-delete-error", "Errore durante l'eliminazione della categoria"));
    //     }
    // }

    // async edit(): Promise<void> {
    //     try {
    //         await Projector.Instance.projectAsyncTo(PlanModal as never, this.task.id);
    //     } catch (_) {

    //     }

    //     this.clearTask();
    // }

    openCommentSection(): void {
        this.commentSectionOpened = true;
    }

    closeCommentsSection(): void {
        this.commentSectionOpened = false;
    }
 
    back() {
        this.$emit('goback')
    }

    hasPermission(permission: string): boolean {
        return this.$can(`${CONFIGURATION.context}.${permission}`);
    }
}