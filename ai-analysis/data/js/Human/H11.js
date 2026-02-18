// Human-style JS: minimal comments, irregular spacing

const users={}
const sessions={}
const tasks=[]
function addUser(name,pass){
    if(users[name]){
        return false
    }
    users[name]=pass
    return true
}

function loginUser(name,pass){
    if(users[name] && users[name]===pass){
        let sid=Math.floor(Math.random()*9000)+1000
        sessions[sid]=name
        return sid
    }
    return null
}

function logoutUser(sid){
    delete sessions[sid]
}

function addTask(sid,title,desc){
    let user=sessions[sid]
    if(user){
        tasks.push({user:user,title:title,desc:desc,status:"pending"})
        return true
    }
    return false
}

function completeTask(sid,index){
    let user=sessions[sid]
    if(user && tasks[index] && tasks[index].user===user){
        tasks[index].status="completed"
        return true
    }
    return false
}

function viewTasks(sid){
    let user=sessions[sid]
    if(user){
        return tasks.filter(t=>t.user===user)
    }
    return []
}

// expand code
function simulateUsers(){
    for(let i=0;i<5;i++){
        addUser("user"+i,"pass"+i)
    }
    for(let i=0;i<5;i++){
        loginUser("user"+i,"pass"+i)
    }
}

function simulateTasks(){
    for(let sid in sessions){
        for(let j=0;j<5;j++){
            addTask(sid,"task"+j,"desc"+j+" for sid "+sid)
        }
    }
}

function completeRandomTasks(){
    for(let sid in sessions){
        for(let i=0;i<tasks.length/2;i++){
            completeTask(sid,i)
        }
    }
}

function fullSimulation(){
    simulateUsers()
    simulateTasks()
    completeRandomTasks()
    for(let sid in sessions){
        viewTasks(sid)
    }
    for(let sid in sessions){
        logoutUser(sid)
    }
}

// expand simulation multiple times
function expandSimulation(){
    for(let i=0;i<5;i++){
        fullSimulation()
    }
}

expandSimulation()
console.log("Human JS Task Simulation Done")
