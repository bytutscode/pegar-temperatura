const router = require('express').Router();
const getWeather = require('../controllers/getWeather');

router.get('/weather', getWeather);
router.use((req, res) => {
    return res.status(404).send();
})

module.exports = router;