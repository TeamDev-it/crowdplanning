class MapType {
  public static readonly topographic: string = "topographic";
  public static readonly imagery: string = 'imagery';
  public static readonly streets: string = "streets";
  public static readonly streetsNight: string = "streets night";
  public static readonly navigation: string = "navigation";
}

export const CONFIGURATION = {
  PlansServiceUri: "https://api.staging.wise.town/crowdplanning",
  priorities: [
    { id: 5, name: 'priority.emergency', icon: '', color: '#c62828' },
    { id: 4, name: 'priority.very-hight', icon: '', color: '#ef5350' },
    { id: 3, name: 'priority.hight', icon: '', color: '#FFB300' },
    { id: 2, name: 'priority.medium', icon: '', color: '#D4E157' },
    { id: 1, name: 'priority.low', icon: '', color: '#81C784' },
    { id: 0, name: 'priority.none', icon: '', color: '#dce0e2' }
  ],
  domainWorkspaceMap: {
    "web.wise.town": "12345678-a111-b222-c333-123456789abd",
    "localhost": "12345678-a111-b222-c333-123456789abd",
    "localhost.local": "12345678-a111-b222-c333-123456789abc",
  }
};
