import express from 'express';
import axios from 'axios';
import { DrupalToWordpress } from './utils/drupal-to-wordpress';
const drupalConfig = {
    protocol: 'http',
    host: 'localhost',
    port: 9000,
};
const app = express();
const port = 3000;

app.use(express.urlencoded({
    extended: true
}));

const wpProxy = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const data = await axios({
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
            _data = DrupalToWordpress.nodeToMedia(data.data);
        } else {
            _data = DrupalToWordpress.nodeToPost(data.data);
        }
        res.json(_data);
        next();
    } catch(err) {
        next(err);
    }
};

app.use('/wp-json/wp/v2/posts/:id', wpProxy);
app.use('/wp-json/wp/v2/media/:id', wpProxy);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});