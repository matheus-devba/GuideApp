// services/media/MediaService.js

const StoryTemplate = require("./templates/story/StoryTemplate");
const StatusTemplate = require("./templates/status/StatusTemplate");
const TemplateRenderer = require("./TemplateRenderer");

class MediaService {

    async generate(options) {

        const {
            template,
            data
        } = options;

        let html;

        switch (template) {

            case "story":
                html = StoryTemplate.render(data);
                break;

            case "status":
                html = StatusTemplate.render(data);
                break;

            default:
                throw new Error("Template não encontrado.");

        }

        return await TemplateRenderer.render(html);

    }

}

module.exports = new MediaService();