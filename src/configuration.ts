export const CONFIGURATION = {
    TasksServiceUri: "http://localhost:5000/tasks",
    priorities: [{ id: 5, name: 'priority.emergency', icon: '', color: '#c62828' },
    { id: 4, name: 'priority.very-hight', icon: '', color: '#ef5350' },
    { id: 3, name: 'priority.hight', icon: '', color: '#FFB300' },
    { id: 2, name: 'priority.medium', icon: '', color: '#D4E157' },
    { id: 1, name: 'priority.low', icon: '', color: '#81C784' },
    { id: 0, name: 'priority.none', icon: '', color: '#dce0e2' }],
    LocationServiceUri: "http://localhost:8081/tasks/",
    FileServiceUri: "http://localhost:5002/generic",
    workspaceId: "12345678-a111-b222-c333-123456789abd",
    defaultTaskType: "PLANS"
};