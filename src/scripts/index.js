const csv = require('csvtojson');
const { Parser } = require('json2csv');

console.log('main loaded');

async function CsvParser(text) {
    const jsonData = await csv({
        noheader: true,
        output: "csv"
    }).fromString(text).then((jsonObj) => {
        console.log(jsonObj);
        return jsonObj;
    });

    const dict = [
        [1, 'record_id'],
        [14, 'date'],
        [54, 'bodystat_waist'],
        [55, 'bodystat_hip'],
        [56, 'bodystat_imp5'],
        [57, 'bodystat_imp50'],
        [58, 'bodystat_imp100'],
        [59, 'bodystat_imp200'],
        [60, 'bodystat_resistance'],
        [61, 'bodystat_reactance'],
        [62, 'bodystat_phaseangle'],
        [44, 'bodystat_ecwi'],
        [46, 'bodystat_icwi'],
        [48, 'bodystat_3swi'],
        [38, 'bodystat_tbw'],
        [49, 'bodystat_drylean'],
        [32, 'bodystat_leankg'],
        [26, 'bodystat_fatkg'],
        [19, 'bodystat_weightkg'],
        [45, 'bodystat_ecwp'],
        [47, 'bodystat_icwp'],
        [35, 'bodystat_tbwp'],
        [999, 'bodystat_3swp'],
        [29, 'bodystat_leanp'],
        [9999, 'bodystat_dryleanp'],
        [23, 'bodystat_fatp'],
        [50, 'bodystat_bmrvalue'],
        [51, 'bodystat_bmrnormal'],
        [43, 'bodystat_bodycellmass'],
        [42, 'bodystat_nutritionindex'],
        [41, 'bodystat_predictionmarker']
    ];

    dict.forEach(([key, value], i) => {
        if (key !== 99 && key !== 999) {
            jsonData[0][key] = value;
        }
        dict[i].push(i);
    });

    console.log(jsonData);
    console.log(dict);
    console.log(dict.slice(0, 20));

    const rows = [];

    for (let i = 1; i < jsonData.length; i++) {
        const newRow = {};

        for (let x = 0; x < dict.length; x++) {
            newRow[dict[x][1]] = jsonData[i][dict[x][0]];
        }

        newRow['bodystat_3swp'] = (Math.round((parseFloat(newRow['bodystat_tbwp']) - (parseFloat(newRow['bodystat_ecwp']) + parseFloat(newRow['bodystat_icwp']))) * 1000) / 1000).toString();

        newRow['bodystat_dryleanp'] = (Math.round((parseFloat(newRow['bodystat_leanp']) - parseFloat(newRow['bodystat_tbwp'])) * 1000) / 1000).toString();

        rows.push(newRow);
    }

    const fields = dict.map(pair => pair[1]);

    const json2csvParser = new Parser({ fields });
    let csv_out = json2csvParser.parse(rows);

    document.getElementById('result').value = csv_out;
    
    csv_out = 'data:text/csv;charset=utf-8,' + csv_out;


    const a = document.createElement('a');
    a.download = 'csv_output.csv';
    a.href = encodeURI(csv_out);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

window.CsvParser = CsvParser;