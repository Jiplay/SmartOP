const { Console } = require('console');
const fs = require('fs');
const Papa = require('papaparse');
const { MongoClient, ServerApiVersion } = require('mongodb');

const contenuFichier = fs.readFileSync("./config.json", 'utf-8');
const objetJson = JSON.parse(contenuFichier);

const client = new MongoClient(objetJson.uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// async function connectAndWriteData(data) {
//   console.log(typeof map)
  
//   try {
//     await client.connect();
//     const database = client.db('SmartOp');
//     const collection = database.collection('Surgeon');

//     await collection.insertMany(data);
//   } catch (error) {
//     console.error('Erreur lors de l\'écriture des données:', error);
//   } finally {
//     await client.close();
//   }
// }


async function connectAndReadData() {
  try {
    await client.connect();
    const database = client.db('SmartOp');
    const collection = database.collection('Surgeon');
    const data = await collection.find().toArray();

    console.log('Données de la collection "surgeon":', data);
    return data
  } catch (error) {
    console.error('Erreur lors de la lecture des données:', error);
  } finally {
    await client.close();
  }
}


// function parseData(data) {

//   const surgeons = new Set();

//   for (const i in data) {
//     surgeons.add(data[i].surgeon);
//   }
  
//   const uniqueSurgeons = Array.from(surgeons);
//   return uniqueSurgeons
// }

// function updateData(oldData, newData) {  
//   var temp = {
//     surgeon: newData.surgeon,
//     specialty: newData.specialty,
//     anesthsiste: oldData.anesthFav + '|' + newData.anesthsiste,
//     nurses: oldData.nurseFav + '|' + newData.nurse1 + '|'+ newData.nurse2,
//     roomFav: oldData.roomFav + '|' + newData.roomNumber,
//     intervention: oldData.operationFav + '|' + newData.intervention
//   }

//   return temp

// }

// function fillMap(infos, data) {
//   for (const i in data) {
//     a = infos.get(data[i].surgeon)
//     a = updateData(a, data[i])
//     infos.set(data[i].surgeon, {spe: a.specialty, anesthFav: a.anesthsiste, nurseFav: a.nurses, roomFav: a.roomFav, operationFav: a.intervention})
//   }
//   // console.log(infos)
//   return infos
// }


// function countMap(infos) {
//   const updatedData = []

//   for (var entry of infos.entries()) {
//     var key = entry[0],
//         room = recurrentFinder(entry[1].roomFav),
//         nurseFav = recurrentFinder(entry[1].nurseFav),
//         operationFav = recurrentFinder(entry[1].operationFav),
//         anesthFav = recurrentFinder(entry[1].anesthFav);
//         intervention = countOccurrences(entry[1].roomFav, '|')
//         newObject = { name: key, spe: entry[1].spe, roomFav: room, nurseFav: nurseFav, opFav: operationFav, AnestFav: anesthFav, intervention: intervention}
//         updatedData.push(newObject)
//   }
//   return updatedData
// }

// function countOccurrences(str, char) {
//   const occurrences = str.split(char).length - 1;
//   return occurrences;
// }


// function recurrentFinder(string) {
//   let array = string.split("|")

//   const filteredList = array.filter(item => item !== 'null');
//   array = filteredList

//   if(array.length == 2) {
//     return array[1];
//   }
//   var modeMap = {};
//   var maxEl = array[0], maxCount = 1;
//   for(var i = 0; i < array.length; i++)
//   {
//     var el = array[i];
//     if(modeMap[el] == null)
//         modeMap[el] = 1;
//     else
//         modeMap[el]++;  
//     if(modeMap[el] > maxCount)
//     {
//         maxEl = el;
//         maxCount = modeMap[el];
//     }
//   }
//   return maxEl;

// }


// function sumInfos(names) {
//   const mappedData = new Map();

//   for (const i in names) {
//     mappedData.set(names[i], { spe: "", nbIntervention:0, anesthFav: "", nurseFav: "", roomFav:"", operationFav: ""})
//   }

//   return mappedData
// }


// function csvToData(path) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path, 'utf8', (err, fileData) => {
//       if (err) {
//         console.error(err);
//         reject(err);
//         return;
//       }
    
//       const parsedData = Papa.parse(fileData, { delimiter: ';' });
    
//       if (parsedData.errors.length > 0) {
//         console.error(parsedData.errors);
//         reject(parsedData.errors);
//         return;
//       }
    
//       const rows = parsedData.data;
    
//       if (rows.length > 0) {
//         const headers = rows[0];
//         const data = [];
    
//         for (let i = 1; i < rows.length; i++) {
//           const row = rows[i];
//           const rowData = {};

//           if (row.length < headers.length) {
//             for (let j = 0; j < headers.length; j++) {
//               const header = headers[j];
//               rowData[header] = row[j] || 'null';
//             }
//           } else {
//             for (let j = 0; j < headers.length; j++) {
//               const header = headers[j];
//               rowData[header] = row[j];
//             }
//           }
    
//           data.push(rowData);
//         }
    
//         resolve(data);
//       } else {
//         resolve(null);
//       }
//     });
//   });
// }

// function dataCleaning(data) {
//   for (const i in data) {
//     if (data[i].intervention == 'null' && data[i].roomNumber == 'null') {
//       data[i] = {
//         surgeon: data[i].surgeon,
//         specialty: data[i].specialty,
//         anesthsiste: 'null',
//         nurse1: data[i].anesthsiste,
//         nurse2: 'null',
//         roomNumber: data[i].nurse1,
//         intervention: data[i].nurse2
//       }
//     }
//     else if (data[i].intervention == 'null' && Number(data[i].nurse2) != "NaN") {
//       data[i] = {
//         surgeon: data[i].surgeon,
//         specialty: data[i].specialty,
//         anesthsiste: data[i].anesthsiste,
//         nurse1: data[i].nurse1,
//         nurse2: 'null',
//         roomNumber: data[i].nurse2,
//         intervention: data[i].roomNumber
//       }
//     }
//   }

//   return data
// }

// function sortByPropertyName(list) {
//   list.sort((a, b) => {
//     const nameA = a.intervention;
//     const nameB = b.intervention;

//     if (nameA > nameB) {
//       return -1;
//     }

//     if (nameA < nameB) {
//       return 1;
//     }

//     return 0;
//   });

//   return list;
// }

// function removeElementByName(list, nameToRemove) {
//   const updatedList = list.filter(item => item.name !== nameToRemove);
//   return updatedList;
// }

// csvToData('interventions.csv')
//   .then(data => {
//     data = dataCleaning(data)
//     uniques = parseData(data)
//     map = sumInfos(uniques)
//     map = fillMap(map, data)
//     map = countMap(map)
//     sortByPropertyName(map)
//     const updatedList = removeElementByName(map, "null");
//     connectAndWriteData(updatedList)
//   })
//   .catch(error => {
//     console.error(error);
//   });


const express = require('express');
const app = express();
const port = 3000;


async function getSurgeons(index) {
  await client.connect();
  const database = client.db('SmartOp');
  const collection = database.collection('Surgeon');
  const data = await collection.find().toArray();
  const startIndex = (index - 1) * 10;
  if (startIndex >= data.length) {
    return ''; 
  }
  const surgeons = data.slice(index-1, 10 * index); 
  return surgeons;
}


app.get('/surgeon/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    data = await getSurgeons(index)
    res.json(data)
  } catch (error) {
    console.error('Erreur lors de la lecture des données:', error);
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Le serveur API est en écoute sur le port ${port}`);
});


