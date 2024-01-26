(async function () {
  var client = ZAFClient.init();
  client.invoke("resize", { width: "100%", height: "200px" });
  const response = await client.get("ticket");
  console.log(response);
  var ticket = response.ticket;
  var name = ticket.requester.name;
  var email = ticket.requester.email;
  showInfo(name, email);
})();

async function showInfo(name, email) {
  var requester_data = {
    name: name,
    email: email,
  };
  var source = document.getElementById("requester-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template(requester_data);
  document.getElementById("content").innerHTML = html;
}

document.getElementById("detokenize").addEventListener("click", function () {
  var email = document.getElementById("email").innerText;
  var name = document.getElementById("name").innerText;
  //console.log(email);
  //console.log(name);
  if (email) {
    // Call your backend endpoint for detokenization
    fetch("http://localhost:3000/detokenize", {
      //mode: 'no-cors',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, name: name }),
    })
      .then((response) => {
        // Check if the response status is OK (status code 200)
        if (!response.ok) {
          console.log(response);
          console.log(response.records[0]);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Parse the JSON response
        return response.json();
      })
      .then((data) => {
        // Log the response data
        var email = data.records[0].value;
        var name = data.records[1].value;
        showInfo(name, email);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.error("User cannot be detokenized");
  }
});
