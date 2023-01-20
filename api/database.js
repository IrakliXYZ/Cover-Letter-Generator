const fs = require('fs');
const uuid = require('uuid');

module.exports = {
    writeToJSON: function(req, result) {
        const statistics = {
            id: uuid.v4(),
            date: new Date().toISOString(),
            applicants_name: req.body.applicants_name,
            email: req.body.email,
            professional_background: req.body.professional_background,
            job_title: req.body.job_title,
            job_post: req.body.job_post,
            response: result
        }

        fs.appendFileSync('./databases/statistics.json', '\n' + JSON.stringify(statistics));
    }
}
