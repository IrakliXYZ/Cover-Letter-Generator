function submitForm() {
    // Get the prompt text from the form
    var applicants_name = document.getElementById("applicants_name").value;
    var email = document.getElementById("email").value;
    var professional_background = document.getElementById("professional_background").value;
    var job_title = document.getElementById("job_title").value;
    var job_post = document.getElementById("job_post").value;


    fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                professional_background,
                job_title,
                job_post
            })
        })
        .then(res => res.json())
        .then(response => {
            console.log(response);
            document.getElementById("cover_letter").innerHTML = response.result.replace(/\n/g, "<br>").replace(/\[Your Name\]/g, applicants_name);



        })
        .catch(error => console.error('Error:', error));
}


function copyToClipboard() {
    var range = document.createRange();
    range.selectNode(document.getElementById("cover_letter"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}