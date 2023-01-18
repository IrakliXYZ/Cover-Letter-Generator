const {
    Configuration,
    OpenAIApi
} = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

    console.log("Received request in generate.js, ln17");

    function generate_prompt(professional_background, job_title, job_post) {
        return `I want you to act as a professional cover letter writer and write one page long professional cover letter. It must be tailored to the specific job and company I am applying to. I will give you my professional background, job title, and job post. 
Professional background: ${professional_background}
Job title: ${job_title} 
Job post: ${job_post}`;
    }
    try {
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
            result: completion.data.choices[0].text
        });
        console.log(generatePrompt(req.body.professional_background, req.body.job_title, req.body.job_post));

    } catch (error) {
        // Consider adjusting the error handling logic
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