const validate_email = require('./validate_email');
const { writeToJSON } = require('./database');
const {
    configuration,
    openai
} = require('./config');

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

    // generates the prompt used to generate the cover letter
    function generate_prompt(professional_background, job_title, job_post) {
        return `I want you to act as a professional cover letter writer and write one page long professional cover letter. It must be tailored to the specific job and company I am applying to. I will give you my professional background, job title, and job post. 
Professional background: ${professional_background}
Job title: ${job_title} 
Job post: ${job_post}
Reply with cover letter:`;
    }

    // checks if the email is whitelisted
    const email_error = validate_email(req.body.email);
    if (email_error) {
        // add try-catch block
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

            // add stats
            writeToJSON(req, completion.data.choices[0].text);

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
    } else {
        return res.status(401).json({
            result: `Sorry, given email ${req.body.email} is not whitelisted, please contact Irakli to get the access.`
        });
    }
}