async function logoutHandler() {
  try {
    console.log("Logging out...");
    const response = await fetch("/api/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      throw new Error("Logout failed.");
    }
  } catch (err) {
    console.error(`${err}`);
    alert(`${err}`);
  }
}

document.querySelector("#logout").addEventListener("click", logoutHandler);

