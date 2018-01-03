
$(document).ready(function () {

  function renderTeamCards(teamRoster) {
    const teamNames = Object.keys(teamRoster)
    $(".tournamentheader").append(`
    <h1>${teamRoster["1"]["0"]["name"]}</h1>
    `)
    Object.keys(teamNames).forEach((t) => {
        $(".team-cards").append(`
        <div class="card mb-3" style="min-width: 15rem">
          <div class="card-header">${teamNames[t]}</div>
            <div class="card-body" data-team-id="${teamNames[t]}">
            </div>
        </div>
        `)

        //space after battlenet_id is required or function will break, do not remove.
        teamRoster[teamNames[t]].forEach((user) => {
          $(`[data-team-id="${teamNames[t]}"`).append(`
          <div class='container player'>
            <span data-balloon=" Level: ${user.level} &#10; Games Won: ${user.games_won} &#10; Gold Medals: ${user.medal_gold} &#10; Silver Medals: ${user.medal_silver} &#10; Bronze Medals: ${user.medal_bronze}" data-balloon-pos="right" data-balloon-break data-team = ${user.team_id} class="player">${user.battlenet_id} </span>
          </div>
            `)
        })
    })

    //If they're the owner, creates event listener to select users to swap
    if(isOwner){
      $('span').click(function(e){
        //TO DO make selector more specific ex. select span within div with team id of #
        //TO DO fix conditionals to make looks nicer
        if(($('.selected').length == 1 && $(e.target).data().team === $('.selected').data().team) && $('.selected').text() !== $(e.target).text()){
          return;
        }
        if($('.selected').length < 3){
          $(e.target).toggleClass('selected');
        }
        if($('.selected').length >= 3 && e.target.className.includes('selected')){
          $(e.target).toggleClass('selected');
        }
      });
    }

  }

  function loadCards() {
    console.log('i am in load cards', tournamentID);
    $.ajax({
      url: '/tournaments/cards.json',
      data: {tournamentID: tournamentID},
      method: 'GET'
    }).done((playerRoster) => {
      console.log(tournamentID);
      renderTeamCards(playerRoster);
    });
  }



  /**
   * Gets enrollment data for a single user from the bnet servers
   * @param  {[string]}  Bnet ID of the user info selected
   * @return {[Promise]} Data from the Bnet server
   */
  function getPlayerEnrollmentData(bnetID){
    return $.ajax({
      url: '/enrollments/' + tournamentID + '/enrollmentinfo.json',
      data: {bnetID: bnetID},
      method: 'GET'
    })
  }


  //
  $('#swap-players-button').click(function(e){
    const selectedPlayers = $(".selected").text().split(' ');
    $.ajax({
      url: '/enrollments/' + tournamentID + '/swap',
      data: {bnetID1: selectedPlayers[0], bnetID2: selectedPlayers[1]},
      method: 'post'
    }).done(() => {
      location.reload();
    });
  });

  loadCards();

  //TO DO: figure out what this does
  $("[data-toggle='toggle']").click(function() {
    const selector = $(this).data("target");
    $(selector).toggleClass('in');
  });

  $(".fa-clipboard").click(function() {
    const link = $(this).data("link")
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).data("link")).select();
    document.execCommand("copy");
    $temp.remove();
    alert(`${link} has been copied!`)
  });

  //TESTING

  //TO DO: make this look....  nicer.
  // Get the modal
  const modalSwap = document.getElementById('swap-players-modal');
  // Get the button that opens the modal
  const btnSwap = document.getElementById("swap-modal-button");
  // When the user clicks on the button, open the modal
  btnSwap.onclick = function() {

    if($('.selected').length < 2){
      alert('must select 2!');
      return;
    }
    modalSwap.style.display = "block";

    //Grabbing player data for each selected player
    const selectedPlayers = $(".selected").text().split(' ');
    const player1 = getPlayerEnrollmentData(selectedPlayers[0]);
    const player2 = getPlayerEnrollmentData(selectedPlayers[1]);

    Promise.all([player1, player2]).then(results => {
      const player1 = results[0];
      const player2 = results[1];
      //Appending user data to the modal window
      $('.swap-players-container').append(`
        <table>
          <tr>
            <th>Battlenet ID</th>
            <th>Primary Class</th>
            <th>Secondary Class</th>
            <th>Level</th>
          </tr>
          <tr>
            <td>${player1.battlenet_id}</td>
            <td>${player1.first_role}</td>
            <td>${player1.second_role}</td>
            <td>${player1.level}</td>
          </tr>
          <tr>
            <td>${player2.battlenet_id}</td>
            <td>${player2.first_role}</td>
            <td>${player2.second_role}</td>
            <td>${player2.level}</td>
          </tr>
        </table>
      `);
    });
  }

  //TO DO: make this look....  nicer.
  // Get the modal
  const modalEmail = document.getElementById('send-email-modal');
  // Get the button that opens the modal
  const btnEmail = document.getElementById("email-notifications-button");
  // When the user clicks on the button, open the modal
  btnEmail.onclick = function() {
    modalEmail.style.display = "block";
    $.ajax({
      url: '/enrollments/' + tournamentID + '/teamnames.json',
      method: 'GET'
    }).done((teamNames) => {
      console.log(teamNames);
      console.log(teamNames.length);
      for(let i = 0; i < teamNames.length; i ++){
        // console.log(teamNames[i].team_id);
        $('#team-ids').append(`<option value="${teamNames[i].team_id}">${teamNames[i].team_id}</option>`)
      }
    });
  }

  //TO DO: make this look....  nicer.
  // Get the modal
  const modalRole = document.getElementById('role-summary-modal');
  // Get the button that opens the modal
  const btnRole = document.getElementById("role-summary-button");
  // When the user clicks on the button, open the modal
  btnRole.onclick = function() {
    $.ajax({
      url: '/tournaments/roles.json',
      data: {tournamentID: tournamentID},
      method: 'GET'
    }).done((playerRoles) => {
      let firstRoleString = '';
      let secondRoleString = '';

      for(let i in playerRoles){
        firstRoleString +=
        `<tr>
          <th>${i}</th>
          <th>${playerRoles[i].offenseFirst}</th>
          <th>${playerRoles[i].defenseFirst}</th>
          <th>${playerRoles[i].tankFirst}</th>
          <th>${playerRoles[i].supportFirst}</th>
        </tr>`

        secondRoleString +=
        `<tr>
          <th>${i}</th>
          <th>${playerRoles[i].offenseSecond}</th>
          <th>${playerRoles[i].defenseSecond}</th>
          <th>${playerRoles[i].tankSecond}</th>
          <th>${playerRoles[i].supportSecond}</th>
        </tr>`
      }

      $('.role-summary-container').append(`
        <h2>Primary Role</h2>
        <table>
          <tr>
            <th>Team</th>
            <th>Offense</th>
            <th>Defense</th>
            <th>Tank</th>
            <th>Support</th>
          </tr>
          ${firstRoleString}
        </table>
        <h2>Secondary Role</h2>
        <table>
          <tr>
            <th>Team</th>
            <th>Offense</th>
            <th>Defense</th>
            <th>Tank</th>
            <th>Support</th>
          </tr>
          ${secondRoleString}
        </table>
        `)
    });

    modalRole.style.display = "block";

  }



  //TO DO: make this look....  nicer.
  // Get the modal
  const modalHighlights = document.getElementById('highlights-modal');
  // Get the button that opens the modal
  const btnHighlights = document.getElementById("highlights-button");
  // When the user clicks on the button, open the modal
  btnHighlights.onclick = function() {
    let highlightsString = "<div class = 'highlights'>";
    $.ajax({
      url: '/highlights/' + tournamentID,
      method: 'GET'
    }).done((highlights) => {

      for(let i = 0; i < highlights.length; i++){

        highlightsString +=
        `<div>
          <div class = 'wrapper'>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${highlights[i].url}?autoplay=0" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
          </div>
        </div>`
      }
      highlightsString += '</div>'
      $('.highlights-container').append(highlightsString);
      console.log(highlightsString)
      $('.highlights').slick();
      modalHighlights.style.display = "block";
    });
  }




  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    console.log('clicked!')
    if (event.target == modalSwap) {
      //Empties the modal container
      $('.swap-players-container').empty();
      //Unselects all players to reset the cards
      $('span').removeClass('selected');
      modalSwap.style.display = "none";
    }
    if (event.target == modalEmail){
      $('#team-ids').empty();
      modalEmail.style.display = "none";
    }
    if (event.target == modalRole){
      $('.role-summary-container').empty();
      modalRole.style.display = "none";
    }
    if (event.target == modalHighlights){
      console.log('clicked!');
      $('.highlights-container').empty();
      modalHighlights.style.display = "none";
    }
  }

});