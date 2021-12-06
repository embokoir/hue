const axios = require('axios')

async function getCurrentTemp() {
  return axios({
    url: 'https://www.nhk.or.jp/weather-data/v1/lv2/current/?pid=tokyo&akey=18cce8ec1fb2982a4e11dd6b1b3efa36'
  })
    .then(res => {
      const tokyoData = res.data.points.filter(point => point.name === '東京都心')[0]
      const currentTokyoTemp = tokyoData.temp
      return currentTokyoTemp
    })
    .catch(err => {return err.response})
}

async function getTomorrowPrecipitation() {
  return axios.get('https://weather.biglobe.ne.jp/smart/data/areaTodayWeather.json')
    .then(res => {
      const tokyoData = res.data.weathers.filter(weather => {
        return weather.prefectureName === '東京都' && weather.subPrefectureName === '東京地方'
      })[0]
      return tokyoData.precipitation
    })
    .catch(err => {
      console.log(err.response.data)
      return false
    })
}

module.exports.getCurrentTemp = getCurrentTemp
module.exports.getTomorrowPrecipitation = getTomorrowPrecipitation