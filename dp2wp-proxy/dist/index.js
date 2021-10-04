"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const drupal_to_wordpress_1 = require("./utils/drupal-to-wordpress");
const drupalConfig = {
    protocol: 'http',
    host: 'localhost',
    port: 9000,
};
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.urlencoded({
    extended: true
}));
const wpProxy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, axios_1.default)({
            url: `/node/${req.params.id}`,
            method: 'get',
            baseURL: `${drupalConfig.protocol}://${drupalConfig.host}:${drupalConfig.port}`,
            auth: {
                username: 'test',
                password: 'test',
            },
            params: {
                '_format': 'json',
            },
            responseType: 'json'
        });
        let _data = {};
        if (req.originalUrl.indexOf('/media') > 0) {
            console.log('media');
            _data = drupal_to_wordpress_1.DrupalToWordpress.nodeToMedia(data.data);
        }
        else {
            _data = drupal_to_wordpress_1.DrupalToWordpress.nodeToPost(data.data);
        }
        res.json(_data);
        next();
    }
    catch (err) {
        next(err);
    }
});
app.use('/wp-json/wp/v2/posts/:id', wpProxy);
app.use('/wp-json/wp/v2/media/:id', wpProxy);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map