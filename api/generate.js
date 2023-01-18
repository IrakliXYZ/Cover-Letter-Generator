const {Configuration, OpenAIApi} = require("openai"); // imports Configuration and OpenAIApi classes from openai package

// const Database = require("@replit/database");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // sets the OpenAI API key
});
const openai = new OpenAIApi(configuration); // creates an instance of the OpenAIApi class

// validates the email address against whitelisted emails
function validate_email(email) {
    const whitelisted_emails = ["career@irakli.xyz", "grubel@beloit.edu"];
    if (!whitelisted_emails.includes(email)) {
        return "Email not whitelisted";
    }
}

// exports an async function as an API endpoint
module.exports = async function(req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured",
            }
        });
        return;
    }

    if (!req.body) {
        console.log('req.body is undefined');
        return res.status(400).json({
            error: {
                message: 'No data provided'
            }
        });
    }

    // checks if the email is whitelisted
    const email_error = validate_email(req.body.email);
    if (email_error) {
        return res.status(401).json({
            error: {
                message: email_error
            }
        });
    }

    // generates the prompt used to generate the cover letter
    function generate_prompt(professional_background, job_title, job_post) {
        return `I want you to act as a professional cover letter writer and write one page long professional cover letter. It must be tailored to the specific job and company I am applying to. I will give you my professional background, job title, and job post. 
Professional background: ${professional_background}
Job title: ${job_title} 
Job post: ${job_post}`;
    }

    try {
        // generates the cover letter using the OpenAI API
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generate_prompt(req.body.professional_background, req.body.job_title, req.body.job_post),
            temperature: 0.6,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });
        res.status(200).json({
            result: completion.data.choices[0].text // sends the generated cover letter to the client
        });
    } catch (error) {
        // handles any errors that occur while making the request to the OpenAI API
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}