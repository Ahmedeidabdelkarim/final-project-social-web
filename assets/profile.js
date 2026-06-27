
function getImageUrl(image) {
    return typeof image === "string" ? image : "";
}

function setUI() {
    let RegisterNewUser = document.getElementById("newUser");
    let logoutBtn = document.querySelector("#logoutBtn");
    let addPost = document.querySelector("#addPost");

    let infoOfUser = document.querySelector("#userInfo");

    let token = localStorage.getItem("token");


    if (token == null) {
        if (addPost != null) {
            addPost.style.setProperty("display", "none", "important");

        }

        RegisterNewUser.style.setProperty("display", "flex", "important");
        logoutBtn.style.setProperty("display", "none", "important");
        infoOfUser.style.setProperty("display", "none", "important");

    } else {

        if (addPost != null) {
            addPost.style.setProperty("display", "block", "important");
        }

        RegisterNewUser.style.setProperty("display", "none", "important")
        logoutBtn.style.setProperty("display", "flex", "important");
        infoOfUser.style.setProperty("display", "flex", "important");
        let userName = document.getElementById("usname");
        let profileImg = document.getElementById("PImge");
        userName.textContent = getCurrentUser().username;
        profileImg.src = getImageUrl(getCurrentUser().profile_image);

    }
}
function getCurrentUserId() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("userid")
    return id
}

/* let user=JSON.parse(localStorage.getItem("user"))
let userId=user.id;
console.log(userId); */

function getUser() {
    const userId = getCurrentUserId();
    if (!userId) return;
    axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}`)
        .then((response) => {
            //console.log(response.data.data);
            let user = response.data.data;
            document.getElementById("info-mail").textContent = user.email;
            document.getElementById("info-name").textContent = user.name;
            document.getElementById("info-username").textContent = user.username;
            document.getElementById("post-count").textContent = user.posts_count;
            document.getElementById("comment-count").textContent = user.comments_count;
            document.getElementById("info-img").src = getImageUrl(user.profile_image);
            document.getElementById("UserName").textContent = `${user.username}'s`;
        })
        .catch((err) => console.error(err.response?.data?.message || err.message));
}



function getUserPosts() {
    const userId = getCurrentUserId();
    if (!userId) return;
    axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`)
        .then((response) => {
            console.log(response.data.data);
            let posts = response.data.data;
            document.getElementById("profile-posts").innerHTML = "";
            for (post of posts) {
                let author = post.author;
                let postImage = post.image;
                let postTitle = "";
                if (post.title != null) {
                    postTitle = post.title;
                }
                let user = getCurrentUser();
                let isMyPost = user != null && post.author.id == user.id;
                let editBtnContent = ``
                if (isMyPost) {
                    editBtnContent = `
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
                        <div style="display:flex;align-items:center;">
                            <img style="width:32px;height:30px" src="${getImageUrl(author.profile_image)}" class="profile" alt="">
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
                            <span id="post-tags-${post.id}">
                            <button class="btn btn-sm rounded-5" style="background-color:gray;color:white;">policy</button>
        
                            <button class="btn btn-sm rounded-5" style="background-color:gray;color:white;">policy</button>
        
                            <button class="btn btn-sm rounded-5" style="background-color:gray;color:white;">policy</button>
                            </span>
                            </span>
            
                        </div>
                    </div>
    
                </div>
                `;
                document.getElementById("profile-posts").innerHTML += content;

                let currentPostId = `post-tags-${post.id}`;
                document.getElementById(currentPostId).innerHTML = "";
                //console.log(post.tags);
                for (tag of post.tags) {
                    let tagsContent = `
                        <button style="background-color:gray;border:none;" class="rounded-5">${tag.name}</button>
                    `
                    document.getElementById(currentPostId).innerHTML += tagsContent;
                }

                setUI();

            }
        })
        .catch((err) => console.error(err.response?.data?.message || err.message));
}

if (document.getElementById("profile-posts")) {
    getUser();
    getUserPosts();
}