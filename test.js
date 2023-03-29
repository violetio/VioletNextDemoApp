let arrs = [
    [{name: 1, sku_ids: [10001, 10002, 10003, 10004, 10005, 10007]}, {name: 2, sku_ids: [10010, 10011, 10012, 10013]}, {name: 3, sku_ids: [10019, 10020, 10021, 10022, 10027]}],
    [{name: 'r', sku_ids: [10001, 10002, 10003, 10010, 10011, 10012, 10019, 10020, 10021]}, {name: 'b', sku_ids: [10004, 10005, 10013, 10022]}, {name: 'g', sku_ids: [10007, 10027]}],
    [{name: 's', sku_ids: [10001, 10004, 10007, 10010, 10013, 10019, 10022]}, {name: 'm', sku_ids: [10002, 10005, 10011, 10020]}, {name: 'l', sku_ids: [10003, 10012, 10021, 10027]}]
];

/*
'1rs': 10001,
'1rm': 10002,
'1rl': 10003,
'1bs': 10004,
'1bm': 10005,
'1bl': null,
'1gs': 10007,
'1gm': null,
'1gl': null,
'2rs': 10010,
'2rm': 10011,
'2rl': 10012,
'2bs': 10013,
'2bm': null,
'2bl': null,
'2gs': null,
'2gm': null,
'2gl': null,
'3rs': 10019,
'3rm': 10020,
'3rl': 10021,
'3bs': 10022,
'3bm': null,
'3bl': null,
'3gs': null,
'3gm': null,
'3gl': 10027
*/


// let arrs = [
//     [{name: 1, sku_ids: [10000, 10001, 10002]}, {name: 2, sku_ids: [10003, 10005]}, {name: 3, sku_ids: [10006, 10008]}],
//     [{name: 'r', sku_ids: [10000, 10003, 10006]}, {name: 'b', sku_ids: [10001]}, {name: 'g', sku_ids: [10002, 10005, 10008]}]
// ];
/*
1r: 10000
1b: 10001
1g: 10002
2r: 10003
2b: null
2g: 10005
3r: 10006
3b: null
3g: 10008
*/

let memo = {};

function doRecurse(m, k, start, productVariants, filteredSkus) {
    if (m[k]) {
        return;
    }
    m[k] = filteredSkus;
    if(start >= productVariants.length){
        // console.log(`k is ${k} with filteredSkus ${filteredSkus}`);
        return;
    }
    // console.log(start);
    for(let j = start; j < productVariants.length; j++){ // Loop through each possible variant color/size/etc...
        for(let z = 0; z < productVariants[j].length; z++) { // Loop through each variant value. color: black, blue, white, green 
            let key = k+productVariants[j][z].name;
            let sku_ids = productVariants[j][z].sku_ids;
            // console.log('Adding two arrays', filteredSkus, 'and',sku_ids, 'at key', key);
            let filtered = [...sku_ids];
            if(filteredSkus) {
                filtered = filtered.filter(function(n) {
                    return filteredSkus.indexOf(n) !== -1;
                })
            }
            doRecurse(m, key, j+1, productVariants, filtered);
        }
    }

    // console.log();
}

for(let i = 0; i < arrs.length; i++){ // Loop through each possible variant color/size/etc...
    doRecurse(memo, "", i, arrs, null);
    // console.log("|");
}

console.log(JSON.stringify(memo, null, 4));
console.log("Only full options:");
console.log(Object.keys(memo).filter((k) => k.length >= 3).map((k) => `${k}: ${memo[k].flat()}`).join('\n'));
