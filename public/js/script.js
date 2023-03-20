const loginButton = document.getElementById("login-button");

async function handleClick() {
    console.log("click");
    const response = await fetch('/login', {
        method: 'GET',
    });
}

loginButton.addEventListener("click", handleClick());