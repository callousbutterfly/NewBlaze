const axios = require('axios');
const { parse } = require('csv-parse');

let applicationList = [];

async function getApplications() {
    const response = await axios.get("https://docs.google.com/spreadsheets/d/1Nszyn1BzvX-Hv6k6z7BSa-CxON0ROVUbOEp6efgK4QE/export?format=csv&id=1Nszyn1BzvX-Hv6k6z7BSa-CxON0ROVUbOEp6efgK4QE&gid=1323993836", { responseType: 'blob' });

    const file = response.data;

    parse(file, { delimiter: "," }, (error, result) => {
        if (error) {
            console.error(error);
        }

        applicationList = result.map(e => ({
            timestamp: e[0], email: e[1], teamName: e[2], contact: e[3], alliance: e[4],
            tournamentChampions: e[5], excellenceAwards: e[6], designAwards: e[7], seasonRecord: e[8], whyJoin: e[9], whyConsider: e[10], 
            goals: e[11], contributions: e[12], image: e[13], teamCount: e[14], otherComments: e[15]
        }));

    });
}