# Description
#   A Hubot script that returns the next week kinro
#
# Configuration:
#   None
#
# Commands:
#   hubot XXX [<args>] - DESCRIPTION
#
# Author:
#   bouzuya <m@bouzuya.net>
#
module.exports = (robot) ->
  cheerio = require 'cheerio'
  moment = require 'moment'
  request = require 'request-b'

  robot.respond /kinro$/i, (res) ->
    url = 'https://kinro.jointv.jp/lineup/list'
    request(url).then (r) ->
      $ = cheerio.load r.body
      movies = []
      $('#lineup_list li:not([class])').each ->
        e = $ @
        url = 'https://kinro.jointv.jp' + e.find('a').attr('href')
        date = moment(e.find('.lineup_list_movie_data').text(), 'YYYY.MM.DD')
        title = e.find('.lineup_list_movie_tit').text()
        movies.push { url, date, title }
      w = moment().endOf('week').subtract(1, 'day')
      message = movies
        .reverse()
        .filter((movie) ->
          w.isSame(movie.date, 'day') or w.isBefore(movie.date, 'day'))
        .map (m) ->
          "#{m.date.format('YYYY-MM-DD')} #{m.title} #{m.url}"
        .join '\n'
      res.send message
