"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex, owjs) => {
  // overwatch api insists on all lowercase
  const offenseHeroes = ['doomfist', 'genji', 'mccree', 'pharah', 'soldier:_76', 'sombra', 'tracer'];
  const defenseHeroes = ['bastion', 'hanzo', 'junkrat', 'mei', 'torbjörn', 'widowmaker'];
  const tankHeroes = ['d.va', 'orisa', 'reinhardt', 'roadhog', 'winston', 'zarya'];
  const supportHeroes = ['ana', 'lúcio', 'mercy', 'moira', 'symmetra', 'zanyatta'];

  /**
   * Provides a sorted array of each player's most played hero (by time)
   * from most to least
   * @param {array} data result of overwatch api
   * @param {array} heroNames const variables of hero names by role type
   * @returns {array}
   */
  function roleTimePlayed(data, heroNames) {
    return Object.keys(data.quickplay.heroes).reduce((sum, key) => {
      const arrayOfTimes = [];
      for (const i in heroNames) {
        if (data.quickplay.heroes[`${heroNames[i]}`]) {
          arrayOfTimes.push(data.quickplay.heroes[`${heroNames[i]}`].time_played);
        }
      }
      return arrayOfTimes.reduce((a, b) => a + b);
    }, 0);
  }

  function playersEnrolled(tournamentID){
    return knex
      .select("users.battlenet_id", "level", "games_won", "medal_gold", "medal_silver", "medal_bronze")
      .from("enrollments")
      .innerJoin("users", "users.id", "enrollments.user_id")
      .where({tournament_id: tournamentID})
      .then((result) => {
        return result
      });
  }


  /**
   * Provides a sorted array of each player's most played (by time) role class
   * from most to least
   * @param {array} data result of overwatch api
   * @returns {array}
   */
  function sortTimePlayed(data) {
    const playerTimeStats = [
      {role: 'offense', time: roleTimePlayed(data, offenseHeroes)},
      {role: 'defense', time: roleTimePlayed(data, defenseHeroes)},
      {role: 'tank', time: roleTimePlayed(data, tankHeroes)},
      {role: 'support', time: roleTimePlayed(data, supportHeroes)}
    ];
    return playerTimeStats.sort((a, b) => {
      return b.time - a.time;
    });
  }

  /**
   * Total time played as a character with the key 'healing_done'
   *
   * @param {array} data result of overwatch api
   * @returns {integer}
   */
  function totalTimeHealing(data) {
    return Object.keys(data.quickplay.heroes).reduce((sum, key) => {
      if (data.quickplay.heroes[key].healing_done) {
        return sum + data.quickplay.heroes[key].time_played;
      }
      return sum;
    }, 0);
  }

  function healsPerSecond(data) {
    return data.quickplay.global.healing_done / totalTimeHealing * 100;
  }

  function dmgPerSecond(data) {
    return data.quickplay.global.all_damage_done / (data.quickplay.global.time_played - totalTimeHealing);
  }

  function getPlayersInfo(battlenetID, tournamentID, userID) {
    return owjs.getAll('pc', 'us', battlenetID)
      .then((data) => {
        const roleRanks = sortTimePlayed(data);
        knex
          .insert({
            'user_id': userID,
            'team_id': null,
            'tournament_id': tournamentID,
            'level': data.profile.level,
            'first_role': roleRanks[0].role,
            'first_role_time_played': roleRanks[0].time,
            'second_role': roleRanks[1].role,
            'second_role_time_played': roleRanks[1].time,
            'medal_gold': data.quickplay.global.medals_gold,
            'medal_silver': data.quickplay.global.medals_silver,
            'medal_bronze': data.quickplay.global.medals_bronze,
            'games_won': data.quickplay.global.games_won
          })
          .into("enrollments")
          .then(() => {
            console.log('done using owjs')
          });
    });
  }

  router.get("/:id/enroll", (req, res) => {
    const tournamentID = req.params.id;
    const currUserID = req.session.userID;
    
    if (!currUserID) {
      // Figure out a better way to handle this. 
      // Maybe status 400, with link to register or sign in
      res.redirect('/users/new');
    } else {
      knex
      .select("battlenet_id", "email")
      .from("users")
      .where({id: currUserID})
      .then((currUser) => {
        const currBattlenetID = currUser[0].battlenet_id;
        const currEmail = currUser[0].email;
        knex
          .select("id")
          .from("enrollments")
          .where({id: currUserID})
          .then((results) => {
            if (results.length > 0 ) {
              // STRETCH: "You've already enrolled to this tournament"
              res.sendStatus(400)
            } else {
              knex
              .select("users.battlenet_id", "tournaments.id", "is_started", "creator_user_id", "no_of_teams", "name", "description")
              .from("tournaments")
              .innerJoin("users", "users.id", "tournaments.creator_user_id")
              .where({"tournaments.id": tournamentID})
              .then( async (results) => {

                const enrolledPlayers = await playersEnrolled(tournamentID);
                const started = results[0].is_started;
                const teamCount = results[0].no_of_teams;
                const tournamentCreator = results[0].battlenet_id;
                const tournamentName = results[0].name;
                const tournamentDescr = results[0].description;
                const isReady = (enrolledPlayers.length === teamCount * 6);

                if (currBattlenetID === tournamentCreator) {
                  // STRETCH: "You cannot play in a tournament you've made"
                  res.sendStatus(400);
                } else {
                  res.render("tournament_enroll", {
                    email: currEmail,
                    teamCount: teamCount,
                    tournamentID: tournamentID,
                    tournamentName: tournamentName,
                    tournamentDescr: tournamentDescr,
                    tournamentCreator: tournamentCreator,
                    enrolledPlayers: enrolledPlayers,
                    isReady: isReady
                  });
                }
              })
            }
          })
      })
    }
  })

  // Adds a new line in to enrollments for each new player
  // given that their battlenet ID exists
  router.post("/:id/enroll/", (req, res) => {
    const currUserID = req.session.userID;
    const tournamentID = req.params.id;
    knex
      .select("id", "battlenet_id")
      .from("users")
      .where({id: currUserID})
      .then( async (results) => {
        if(results.length === 0){
          // STRETCH: Show 'Invalid Battlenet ID' error page
          res.sendStatus(404);
        } else{
          await getPlayersInfo(results[0].battlenet_id, tournamentID, currUserID)
          // THIS RESPONSE DOES NOT WORK. NEITHER RENDER OR REDIRECT WORKS
          // User's info is inserted to enrollments though
          res.render("index", {email: req.session.email})
        }
      });
  });

  return router;
};
