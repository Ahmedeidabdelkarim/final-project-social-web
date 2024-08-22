
setUI();

let baseURL = "https://tarmeezacademy.com/api/v1";
let currentPage=1;
let lastPage=1;

window.addEventListener("scroll",function(){
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  if (endOfPage && currentPage<lastPage) {
    currentPage=currentPage+1
    getPosts(false,currentPage);
}})


  function userClicked(userid){
    window.location=`/assets/profile.html?userid=${userid}`;
  }

  function getPosts(reload=true,currentPage=1) {
    toggleLoader(true);
    axios.get(`${baseURL}/posts?limit=4&page=${currentPage}`)
    .then((response)=>{
      toggleLoader(false);
    let posts = response.data.data;
    lastPage=response.data.meta.last_page;
    if(reload){
      document.getElementById("posts").innerHTML = "";
    }
    
    for (post of posts) {
    let author = post.author;
    let postImage = post.image;
    let postTitle = "";
    if (post.title != null) {
      postTitle = post.title;
    }

    let user=getCurrentUser();
    let isMyPost=user!=null&&post.author.id==user.id;
    let editBtnContent=``
    if(isMyPost){
      editBtnContent=`
        <div id="editBtn">
                  <button style="margin-right:5px;height:30px;line-height:1;border-radius:15px;" class="btn btn-danger" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                  
                  <button style="margin-right:5px;height:30px;line-height:1;border-radius:15px" class="btn btn-secondary" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                  
        </div>
      `
    }


    if (typeof postImage != "string") {
      postImage = "";
    }
    let content = `
            <div class="content shadow my-2"">
            <div class="nav">
                <div onclick="userClicked(${author.id})" style="display:flex;align-items:center;cursor:pointer">
                  <img style="width:32px;height:30px" src="${author.profile_image}" class="profile" alt="">
                  <h6>${author.name}</h6>
                </div>

                ${editBtnContent}
                
            </div>
            <div class="contentText" onclick="postClicked(${post.id})" style="cursor:pointer;">
                <div class="img">
                    <img style="max-height: 535px;"  src="${postImage}" alt="">
                </div>
                <p style="color: gray;">${post.created_at}</p>
                <h3>${postTitle}</h3>
                <p>${post.body}</p>
                <hr>
                <div class="comment">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <p>(${post.comments_count}) comments</p>
                    
                    <span id="post-tags-${post.id}">
                    
                    </span>
                    
                </div>
            </div>
            
        </div>
        `;

    document.getElementById("posts").innerHTML += content;

    let currentPostId=`post-tags-${post.id}`;
    document.getElementById(currentPostId).innerHTML="";
    //console.log(post.tags);
    for(tag of post.tags){
        let tagsContent=`
            <button style="background-color:gray;border:none;" class="rounded-5">${tag.name}</button>
        `
        document.getElementById(currentPostId).innerHTML+=tagsContent;
    }

    setUI();

  }


  })

  
}


getPosts();


function setUI() {
  let RegisterNewUser = document.getElementById("newUser");
  let logoutBtn = document.querySelector("#logoutBtn");
  let addPost = document.querySelector("#addPost");

  let infoOfUser = document.querySelector("#userInfo");

  let token = localStorage.getItem("token");
  

  if(token == null) {
    if(addPost!=null){
      addPost.style.setProperty("display","none","important");
      
    }

    RegisterNewUser.style.setProperty("display","flex","important");
    logoutBtn.style.setProperty("display","none","important");
    infoOfUser.style.setProperty("display","none","important");
    
  }else{

    if(addPost!=null){
      addPost.style.setProperty("display","block","important");
    }
    
    RegisterNewUser.style.setProperty("display","none","important")
    logoutBtn.style.setProperty("display","flex","important");
    infoOfUser.style.setProperty("display","flex","important");
    let userName = document.getElementById("usname");
    let profileImg = document.getElementById("PImge");
    userName.textContent=getCurrentUser().username;
    profileImg.src=`${getCurrentUser().profile_image}`
    
  }
}

function getCurrentUser(){
  let user=null;
  let userInfo = localStorage.getItem("user");
  if(userInfo!=null){
    user=JSON.parse(userInfo);
  }
  
  return user
}

////////////////login function/////////////////////


function loginBtnClicked() {
  const userName = document.getElementById("userName").value;
  const Password = document.getElementById("password").value;

  
  toggleLoader(true);

  axios.post("https://tarmeezacademy.com/api/v1/login",{
    "username" : userName,
    "password" : Password
})
  .then((response) => {

    toggleLoader(false);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    //document.getElementById("loginModal").classList.add("hidden");

    const modal = document.getElementById("loginModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    

    setUI();
    showAlert("Nice, you loged in successfully!","success");
    location.reload();
    getUser();
    getUserPosts();
  });


  
}


/* const token = localStorage.getItem("token");
  console.log(typeof token); */





function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUI();
  showAlert("Nice, you loged out!","danger");
  window.location="/index.html"
  getUser();
  getUserPosts();

}



function showAlert(customMessage,type) {
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
    }
    appendAlert(customMessage,type);

    //close Alert After 2 seconds
    /* setTimeout(()=>{
        //const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
    //alert.close()
    },2000) */
    
    
}

////////Register function///////////////

function registerBtnClicked(){
  const registerUserName = document.getElementById("registerUserName").value;
  const registerName = document.getElementById("registerName").value;
  const registerPassword = document.getElementById("registerPassword").value;
  const registerEmail = document.getElementById("registerEmail").value;


  const registerImg = document.getElementById("registerImg").files[0];

  let registerData=new FormData();
  registerData.append("username" , registerUserName)
  registerData.append("password" , registerPassword)
  registerData.append("name" , registerName)
  registerData.append("image" , registerImg)
  registerData.append("email" , registerEmail)

  toggleLoader(true);

  axios.post("https://tarmeezacademy.com/api/v1/register",registerData,{headers:{
    "Accept":"application/json"
  }})
  .then((response) => {
    toggleLoader(false);
    //console.log(response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    //document.getElementById("loginModal").classList.add("hidden");

    const modal = document.getElementById("RegisterModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    setUI();
    showAlert("Nice, you Registered Successfully!","success");
    location.reload();
    getUser();
    getUserPosts();
    
  }).catch(err=>{
    let message = err.reponse.data.message;
    showAlert(message,"danger")
  })

  
}


/*add new post*/

function createNewPostClicked(){
  const postId = document.getElementById("post-id").value;
  let isCreate=postId==null||postId==""

  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const postimage = document.getElementById("image").files[0];

  const token=localStorage.getItem("token");

  let formData=new FormData();
  formData.append("image" , postimage)
  formData.append("body" , body)
  formData.append("title" , title)
  
  let headers={
    //"Content-Type": "multipart/form-data",
    "authorization":`Bearer ${token}`
  }

  let url=``

  
  if(isCreate==true){
    url=`https://tarmeezacademy.com/api/v1/posts`;
  }
  else
  {
    formData.append("_method","put")
    url=`https://tarmeezacademy.com/api/v1/posts/${postId}`;
  }

  axios.post(url,formData,{
    headers:headers
    })
    .then((response) => {
      console.log(response);
      const modal = document.getElementById("addPostModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Nice, you add post successfully!","success")
      getUser();
      getUserPosts();
      getPosts();
      
      }
    )
    .catch((err)=>{
      //console.log(err);
      showAlert(`${err.response.data.message}, your post not added successfully!`,"danger")
    })
  
  
  
}


////////*add comments*/////////

function postClicked(id){
  console.log(id);
  window.location=`/assets/postDetails.html?postId=${id}`;

}


//////////////////////////edit post////////////////

function editPostBtnClicked(postObject){
  let post=JSON.parse(decodeURIComponent(postObject))

  //console.log(post);
  document.getElementById("post-id").value=post.id
  document.getElementById("title").value=post.title;
  document.getElementById("body").value=post.body;
  //document.getElementById("image").files[0]=post.postImage;

  let postModal=new bootstrap.Modal(document.getElementById("addPostModal"));

  document.getElementById("postModalTitle").innerHTML="Edit Post";
  document.getElementById("logBtn").innerHTML="Update";

  postModal.toggle();
  getUser();
  getUserPosts();
  

}

/////////////////////////delete post///////////////////////////
function deletePostBtnClicked(postObject){
  let post=JSON.parse(decodeURIComponent(postObject));
  document.getElementById("delete-post-id-input").value=post.id
  document.getElementById("delet-post-title").textContent=`: "${post.title}"`
  let deletPostModal=new bootstrap.Modal(document.getElementById("delet-post-modal"));
  deletPostModal.toggle();
  
}

function confirmPostDelete(){
  const postId=document.getElementById("delete-post-id-input").value;

  const url=`${baseURL}/posts/${postId}`;
  const token=localStorage.getItem("token");

  let headers={
    //"Content-Type": "multipart/form-data",
    "authorization":`Bearer ${token}`
  }
  axios.delete(url,{headers:headers})
  .then((response) => {
    

    const modal = document.getElementById("delet-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    showAlert("The Post Has Been Deleted Successfully","success");
    getUserPosts();
    getPosts();
    getUser();
    
  }).catch(error=>{
    const message=error.reponse.data.message;
    showAlert(message,"danger")
  })

}





function addBtnClicked(){

  //console.log(post);
  document.getElementById("post-id").value=""
  document.getElementById("title").value="";
  document.getElementById("body").value="";
  //document.getElementById("image").files[0]=post.postImage;

  let postModal=new bootstrap.Modal(document.getElementById("addPostModal"));

  document.getElementById("postModalTitle").innerHTML="Add New Post";
  document.getElementById("logBtn").innerHTML="Create";


  postModal.toggle();
}


function profileClicked(){
  let user=getCurrentUser();
  let userid=user.id;
  window.location=`/assets/profile.html?userid=${userid}`;
}

function toggleLoader(show){
  if(show){
    document.getElementById("loader").style.visibility='visible';
  }else{
    document.getElementById("loader").style.visibility='hidden';

  }
}



