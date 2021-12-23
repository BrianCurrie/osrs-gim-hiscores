const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const keys = require('./keys');

async function getGroupUsernames(groupName) {
    // JSDOM instance of group ironman highscores so we can scrape data
    const responseHtml = await JSDOM.fromURL(
        `https://secure.runescape.com/m=hiscore_oldschool_ironman/a=135/group-ironman/view-group?name=${groupName}`
    );
    // Query all player hyperlinks
    const playerLinks =
        responseHtml.window.document.querySelectorAll('.uc-scroll__link');
    // Nodelist of hyperlinks to array of usernames
    const rawUsernames = [...playerLinks].map((player) => player.text);
    // Handle &nbsp in username, convert to normal space
    const usernames = rawUsernames.map((username) =>
        username.replace(/\s/g, ' ')
    );

    return usernames;
}

async function getUserStats(username) {
    let response = await axios
        .get(
            `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${username}`
        )
        .catch(() => {
            throw new Error('Invalid request, check username.');
        });
    let obj = toStatsObject(await response.data.split(/\n/));
    return obj;
}

async function getGroupStats(groupName) {
    let usernames = await getGroupUsernames(groupName);
    let groupData = {};

    for (let username of usernames) {
        let userStats = await getUserStats(username);
        groupData[username] = userStats;
    }

    if (usernames.length !== 0) {
        return groupData;
    } else {
        throw new Error('Invalid request, check group name.');
    }
}

function toStatsObject(rawData) {
    let userData = {};
    for (let i = 0; i < keys.stats.length; i++) {
        const currRow = rawData[i].split(/,/);
        if (currRow.length === 3) {
            userData[keys.stats[i]] = {
                rank: currRow[0],
                level: currRow[1],
                experience: currRow[2],
            };
        } else if (currRow.length === 2) {
            userData[keys.stats[i]] = {
                rank: currRow[0],
                value: currRow[1],
            };
        }
    }
    return userData;
}

exports.getGroupUsernames = getGroupUsernames;
exports.getUserStats = getUserStats;
exports.getGroupStats = getGroupStats;

//Example get group usernames
//getGroupUsernames('farmers').then((data) => console.log(data));

//Example get user stats
//getUserStats('Farmer Faux').then((data) => console.log(data));

//Example get group stats
//getGroupStats('farmers').then((data) => console.log(data));
