const fs = require("fs").promises;

let json;

async function connectToJSON() {
    try {
        await fs.access('./databases/statistics.json', fs.constants.F_OK)
            .catch(() => {
                json = {
                    statistics: []
                };
                fs.promises.writeFile('./databases/statistics.json', JSON.stringify(json, null, 2), 'utf8');
            });
        json = JSON.parse(fs.readFileSync('./databases/statistics.json', 'utf8'));
    } catch (err) {
        console.log(err);
    }
}

async function writeToJSON(req, result) {
    await connectToJSON();
    const insertData = {
        applicants_name: req.body.applicants_name,
        email: req.body.email,
        professional_background: req.body.professional_background,
        job_title: req.body.job_title,
        job_post: req.body.job_post,
        response: result
    };
    json.statistics.push(insertData);
    await fs.promises.writeFile('./databases/statistics.json', JSON.stringify(json, null, 2), 'utf8');
}

module.exports = {
    connectToJSON,
    writeToJSON
}