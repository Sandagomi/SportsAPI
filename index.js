const PORT = process.env.PORT || 8000
const express = require ('express')
const cheerio = require ('cheerio')
const axios = require ('axios')
const { response } = require('express')

const app = express()


const sportlists = [
    {
        name: 'times',
        address: 'https://www.thetimes.co.uk/sport',
        Base: ''
        
    },
    {
        name: 'gaurdian',
        address: 'https://www.theguardian.com/uk/sport',
        Base: 'https://www.theguardian.com'
        
    }
]



const articles = []

sportlists.forEach(sportlist => {

    axios.get(sportlist.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("sport")', html).each(function () {

                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: sportlist.base + url,
                    source: sportlist.name
                })

            })

        })

})

app.get('/', (req,res) => {
    res.json ('welcome to my sports news API')
}) // root page


app.get('/sports', (req,res) => {
    res.json(articles)
})


app.get('/sports/:sportnewslistId', (req,res) => {

    const sportnewslistId = req.params.sportnewslistId

    const sportnewslistAddress = sportnewslists.filter(sportnewslist => sportnewslist.name == sportnewslistId)[0].address 
    const sportnewslistBase = sportnewslists.filter(sportnewslist => sportnewslist.name == sportnewslistId)[0].base
    

    axios.get(sportnewslistAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("sport")', html).each(function () {

                const title = $(this).text()
                const url = $(this).attr('href')

                specificArticles.push({
                    title,
                    url: sportnewslistBase + url,
                    source: sportnewslistId
                })

            })

            res.json(specificArticles)

        }).catch((err) => {
            console.log(err)
        })

})




app.listen(PORT, () => console.log(`server runnning on PORT ${PORT}`))