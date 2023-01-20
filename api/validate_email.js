function validate_email(email) {
    const whitelisted_emails = ["career@irakli.xyz", "grubel@beloit.edu", "joshia@beloit.edu", "Mariambukhrashvili07@gmail.com", "irfanl@beloit.edu"];
    if (!whitelisted_emails.includes(email)) {
        return false;
    } else {
        return true;
    }
}
module.exports = validate_email;