let CustomerState = {};
let WorkerState = {};
let AskForJobState = {
    uid: '',
    clientName :'',
    workerTypeWanted:'',
    location:'',
    description:'',
    images: []
}
let workerJobState = {};
let chatPartyState = {
    sentBy:'',
    sentTo:''
}

export const writeToChatPartyState = async(value) => {
    chatPartyState = {...chatPartyState, ...value};
}

export const getChatPartyState = () =>{
    return chatPartyState;
}

export const clearChatPartyState = () => {
    chatPartyState = {};
}

export const writeWorkerJobState = async(value) => {
    workerJobState = {...workerJobState, ...value}
}

export const readWorkerJobState = () =>{
    return workerJobState;
}

export const clearWorkerJobState = () => {
    workerJobState = {};
}

//pass in Objects
//Customer

export const writeToCustomerState = async (value) =>{
    CustomerState = {...CustomerState, ...value}
}

export const readCustomerState = ()=>{
    return CustomerState;
}

export const clearCustomerState = () => {
    CustomerState = {};
}

export const writeToWorkerState = async (value) =>{
    WorkerState = {...WorkerState, ...value}
}

export const readWorkerState = () =>{
    return WorkerState;
}

export const clearWorkerState = () =>{
    WorkerState = {};
}

export const writeAskForJobState = async (value) =>{
    AskForJobState = {...AskForJobState, ...value}
}

export const getAskForJobState = ()=>{
    return AskForJobState;
}

export const cleatAskForJobState = ()=>{
    AskForJobState = {
        uid: '',
        clientName :'',
        serviceWanted:'',
        location:'',
        description:'',
        images: []
    }
}
