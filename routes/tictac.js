const {Router} = require('express')
const Tictac = require('../models/tictac')
const keys = require('../keys/keys')
const router = Router()

// get statistic
router.get('/statistic', async (req, res) => {
    try {
        const tictac = await Tictac.findById(keys.STATISTIC_ID)
        res.status(200).json({
            total: tictac.total,
            wins: tictac.wins,
            ties: tictac.ties
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

//updateStatistic
router.post('/statistic/:id', async (req, res) => {
    try {
        const tictac = await Tictac.findById(keys.STATISTIC_ID)
        if (req.params.id === 'win') {
            tictac.wins += 1
            tictac.total += 1
        } else if (req.params.id === 'tie') {
            tictac.ties += 1
            tictac.total += 1
        }
        await tictac.save()
        res.status(200).json(tictac)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})


module.exports = router