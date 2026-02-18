// Human-style JS: minimal comments, irregular spacing

const users={}
const sessions={}
const posts=[]

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

function addPost(sid,title,content){
    let user=sessions[sid]
    if(user){
        posts.push({user:user,title:title,content:content})
        return true
    }
    return false
}

function viewPosts(sid){
    let user=sessions[sid]
    if(user){
        return posts.filter(p=>p.user===user)
    }
    return []
}

function deletePost(sid,index){
    let user=sessions[sid]
    if(user && posts[index] && posts[index].user===user){
        posts.splice(index,1)
        return true
    }
    return false
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

function simulatePosts(){
    for(let sid in sessions){
        for(let j=0;j<5;j++){
            addPost(sid,"title"+j,"content"+j+" for sid "+sid)
        }
    }
}

function deleteRandomPosts(){
    for(let sid in sessions){
        for(let i=0;i<posts.length/2;i++){
            deletePost(sid,i)
        }
    }
}

function fullSimulation(){
    simulateUsers()
    simulatePosts()
    deleteRandomPosts()
    for(let sid in sessions){
        viewPosts(sid)
    }
    for(let sid in sessions){
        logoutUser(sid)
    }
}

// repeat simulation
function expandSimulation(){
    for(let i=0;i<5;i++){
        fullSimulation()
    }
}

expandSimulation()
console.log("Human JS Blog Simulation Done")
