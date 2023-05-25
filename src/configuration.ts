class MapType {
    public static readonly topographic: string = "topographic";
    public static readonly imagery: string = 'imagery';
    public static readonly streets: string = "streets";
    public static readonly streetsNight: string = "streets night";
    public static readonly navigation: string = "navigation";
}

export const CONFIGURATION = {
    PlansServiceUri: "http://localhost:5000/crowdplanning",
    priorities: [{ id: 5, name: 'priority.emergency', icon: '', color: '#c62828' },
    { id: 4, name: 'priority.very-hight', icon: '', color: '#ef5350' },
    { id: 3, name: 'priority.hight', icon: '', color: '#FFB300' },
    { id: 2, name: 'priority.medium', icon: '', color: '#D4E157' },
    { id: 1, name: 'priority.low', icon: '', color: '#81C784' },
    { id: 0, name: 'priority.none', icon: '', color: '#dce0e2' }],
    LocationServiceUri: "http://localhost:8081/tasks/",
    FileServiceUri: "https://api.v2.wise.town/generic",
    defaultTaskType: "PLANS",
    domainWorkspaceMap: new Map<string, string>([
        ["app.v2.wise.town", "12345678-a111-b222-c333-123456789abd"],
        ["localhost", "12345678-a111-b222-c333-123456789abd"]
    ]),
    planMapType: [
        { value: MapType.topographic, labelKey: 'plans.modal.maptype.topographic', labelText: 'Topografica' },
        { value: MapType.imagery, labelKey: 'plans.modal.maptype.imagery', labelText: 'Imagery' },
        { value: MapType.streets, labelKey: 'plans.modal.maptype.streets', labelText: "Streets" },
        { value: MapType.streetsNight, labelKey: 'plans.modal.maptype.streets-night', labelText: "Streets night" },
        { value: MapType.navigation, labelKey: 'plans.modal.maptype.navigation', labelText: "Navigation" }
    ] as Array<{ value: string, labelKey: string, labelText: string }>
};
