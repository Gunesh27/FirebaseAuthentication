// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_vUOZXvfkoga8RC33ws3HX2AO-NaL-lk",
    authDomain: "fir-auth-d0fa8.firebaseapp.com",
    projectId: "fir-auth-d0fa8",
    storageBucket: "fir-auth-d0fa8.appspot.com",
    messagingSenderId: "126838923257",
    appId: "1:126838923257:web:b6461f1cadaf738fd4e728",
    measurementId: "G-ZPZX9BM27X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.querySelectorAll(".login-signup")[0];
const signupForm = document.querySelectorAll(".login-signup")[1];
const nav_to_login = document.querySelector("#nav-to-login");
const nav_to_signup = document.querySelector("#nav-to-signup");
const login_submit = document.querySelector("#login-submit")
const signup_submit = document.querySelector("#signup-submit")
const login_loader = document.querySelectorAll(".loader")[0];
const signup_loader = document.querySelectorAll(".loader")[1];
const forgot_pwd = document.querySelector(".forgot-pwd");
const details = document.querySelector(".user-details")
const userDetails = (id,user)=> {
    console.log(id);
    window.localStorage.setItem("currentlyLoggedIn", id)
    const docRef = doc(db, `users`, `${id}`);
    const docSnap = getDoc(docRef)
    console.log(docSnap);
    docSnap.then((docSnap)=>{
        if (docSnap.exists()) {
            const h1 = details.children[0]
            h1.textContent = `Welcome ${docSnap.data().userName}`
            const signout = details.children[1]
            details.style.display = "block"
            signout.addEventListener("click", () => {
                signOut(auth).then(() => {
                    window.localStorage.removeItem("currentlyLoggedIn")
                    details.style.display = "none";
                    loginForm.style.display = "block"
                })
            })
        }
        else {
            console.log("No such document!");
        }
    }).catch((err)=>{
        console.log(err);
    })
    
}
window.onload = () => {
  
    try {
        const currentUser = window.localStorage.getItem("currently_loggedIn")
        if (currentUser === null) {
            throw new Error("No Current User")
        }
        else {

            userDetails(currentUser)
        }
    }
    catch (err) {
        loginForm.style.display = "block"
        signupForm.style.display = "none"
    }
}

nav_to_signup.addEventListener("click", () => {
    loginForm.style.display = "none"
    signupForm.style.display = "block"
    document.querySelector("#login").reset();
})
nav_to_login.addEventListener("click", () => {
    loginForm.style.display = "block"
    signupForm.style.display = "none"
    document.querySelector("#signup").reset();
})
signup_submit.addEventListener("click", (event) => {
    event.preventDefault();
    signup_submit.style.display = "none"
    signup_loader.style.display = "block";

    const userName = document.querySelector("#signup-username").value;
    const email = document.querySelector("#signup-email").value;
    const password = document.querySelector("#signup-pwd").value;
    createUserWithEmailAndPassword(auth, email, password).then((cred) => {

        swal({
            title: "Account Created Successfully",
            icon: "success"
        }).then(async function () {
            await setDoc(doc(db, "users", `${cred.user.uid}`), {
                userName: userName,
                email: email
            });

        }).then(() => {
            signup_submit.style.display = "block"
            signup_loader.style.display = "none";
            document.querySelector("#signup").reset();
            signupForm.style.display = "none"
            loginForm.style.display = "block"
        })
    }).catch((err) => {
        swal({
            title: err,
            icon: "error"
        }).then(() => {
            signup_submit.style.display = "block";
            signup_loader.style.display = "none"
        }).catch((err) => {
            swal({
                title: err,
                icon: "error"
            }).then(() => {
                signup_submit.style.display = "block";
                signup_loader.style.display = "none"
            })

        })
    })
})

login_submit.addEventListener("click", (event) => {
    event.preventDefault();
    login_submit.style.display = "none"
    login_loader.style.display = "block"
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-pwd").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            swal({
                title: "Successfully logged in",
                icon: "success"
            }).then(() => {
                login_submit.style.display = "block"
                login_loader.style.display = "none"
                document.querySelector("#login").reset();
                loginForm.style.display = "none"
                userDetails(cred.user.uid,cred.user)
            })

        }).catch((err) => {
            swal({
                title: err,
                icon: "error"
            }).then(() => {
                login_submit.style.display = "block";
                login_loader.style.display = "none"
                document.querySelector("#login").reset();
            })
        })
})
forgot_pwd.addEventListener("click", () => {
    swal({
        title: "Reset password",
        content: {
            element: 'input',
            attributes: {
                placeholder: "Type your Email",
                type: 'email'
            }
        }
    }).then((val) => {
        login_submit.style.display = "none";
        login_loader.style.display = "block";

        sendPasswordResetEmail(auth, val).then(() => {
            swal({
                title: "check your email",
                icon: "success"
            }).then(() => {
                login_submit.style.display = "block";
                login_loader.style.display = "none";
            })
        }).catch(err => {
            swal({
                title: err,
                icon: "error"
            }).then(() => {
                login_submit.style.display = "block";
                login_loader.style.display = "none";
            })
        })
    })
})