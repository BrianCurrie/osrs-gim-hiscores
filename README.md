# OSRS GIM Hiscores

Group ironman support for the Old School Runescape hiscores API, returning easy to use JSON.

## Installation

```bash
$ npm install osrs-gim-hiscores
```

## Usage

Install then import package

```javascript
const { hiscores } = require('osrs-gim-hiscores');
```

`getGroupUsernames(groupName)`

```javascript
hiscores
    .getGroupUsernames('farmers')
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

// Output: [ 'CattleFarmer', 'Farmer Faux', 'RotaryTiller', 'Ploughing' ]
```

`getUserStats(username)`

```javascript
hiscores
    .getUserStats('CattleFarmer')
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

/* Output: 
    {
        overall: { rank: '1', level: '2277', experience: '200000000' },
        attack: { ... },
        defence: { ... },
        strength: { ... },
        ...
        leaguePoints: { rank: '1', value: '99999' },
        ...
        allClues: { rank: '1', value: '99999' },
        ...
        abyssalSire: { rank: '1', value: '99999' },
        ...
    }
*/
```

`getGroupStats(groupName)`

```javascript
hiscores
    .getGroupStats('farmers')
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

/* Output: 
    {
        CattleFarmer: {
            overall: { rank: '1', level: '2277', experience: '200000000' },
            ...
        },
        'Farmer Faux': {
            overall: { rank: '1', level: '2277', experience: '200000000' },
            ...
        },
        ...
    }
*/
```

## How it works

`osrs-gim-hiscores` scrapes individual group's usernames from the official Old School Runescape hiscores website, then calls the official hiscores API using those usernames. This isn't an ideal solution but it's the best we have until the hiscores API supports group ironman.
