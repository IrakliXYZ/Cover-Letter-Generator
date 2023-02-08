function validate_email(email) {
    const whitelisted_emails = ["career@irakli.xyz", "grubel@beloit.edu", "joshia@beloit.edu", "mariambukhrashvili07@gmail.com", "taatmaisuradze@gmail.com", "irfanl@beloit.edu", "fsalazar07@aol.com", "jmanyariv@gmail.com", "otisnt@beloit.edu", "careerworks@beloit.edu"];
    if (!whitelisted_emails.includes(email)) {
        return false;
    } else {
        return true;
    }
}
module.exports = validate_email;