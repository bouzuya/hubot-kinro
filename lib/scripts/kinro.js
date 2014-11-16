// Description
//   A Hubot script that returns the next week kinro
//
// Configuration:
//   None
//
// Commands:
//   hubot XXX [<args>] - DESCRIPTION
//
// Author:
//   bouzuya <m@bouzuya.net>
//
module.exports = function(robot) {
  var cheerio, moment, request;
  cheerio = require('cheerio');
  moment = require('moment');
  request = require('request-b');
  return robot.respond(/kinro$/i, function(res) {
    var url;
    url = 'https://kinro.jointv.jp/lineup/list';
    return request(url).then(function(r) {
      var $, message, movies, w;
      $ = cheerio.load(r.body);
      movies = [];
      $('#lineup_list li:not([class])').each(function() {
        var date, e, title;
        e = $(this);
        url = 'https://kinro.jointv.jp' + e.find('a').attr('href');
        date = moment(e.find('.lineup_list_movie_data').text(), 'YYYY.MM.DD');
        title = e.find('.lineup_list_movie_tit').text();
        return movies.push({
          url: url,
          date: date,
          title: title
        });
      });
      w = moment().endOf('week').subtract(1, 'day');
      message = movies.reverse().filter(function(movie) {
        return w.isSame(movie.date, 'day') || w.isBefore(movie.date, 'day');
      }).map(function(m) {
        return "" + (m.date.format('YYYY-MM-DD')) + " " + m.title + " " + m.url;
      }).join('\n');
      return res.send(message);
    });
  });
};
