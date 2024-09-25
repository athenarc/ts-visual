import { IAlerts } from 'app/shared/model/alert.model';
import moment from 'moment';

// ORIGINAL IMPROVED
const chartAlertingChecker = (
  data: { [key: number]: { timestamp: number; value: number }[] },
  alerts: IAlerts[],
  dataset: any,
  selectedMeasures: any[],
  alertResults: {}
) => {
  const selAlertMeasuresSet = new Set(getMatchedMeasures(alerts, dataset, selectedMeasures));
  const allAlerts = {};
  for (const alert of alerts) {
    if (selAlertMeasuresSet.has(alert.measure) && alert.active && Object.hasOwn(data, dataset.header.indexOf(alert.measure))) {
      const measureIndex = dataset.header.indexOf(alert.measure);
      const dataCut = data[measureIndex];
      const acceptedValues = [];
      const durationInterval = moment.duration(alert.duration.number, alert.duration.unit);
      let startTimestamp = null;

      for (let i = 0; i < dataCut.length; i++) {
        const { value, timestamp } = dataCut[i];
        const bool = checker(value, alert.operation, alert.values);

        if (bool && startTimestamp === null) {
          startTimestamp = timestamp;
        }

        if (!bool && startTimestamp !== null) {
          const endTimestamp = timestamp;
          if (moment.duration(moment(endTimestamp).diff(moment(startTimestamp))) >= durationInterval) {
            acceptedValues.push([startTimestamp, endTimestamp]);
          }
          startTimestamp = null;
        }
      }

      // Check if an alert condition is active at the end of the data
      if (startTimestamp !== null) {
        const lastTimestamp = dataCut[dataCut.length - 1].timestamp;
        if (moment.duration(moment(lastTimestamp).diff(moment(startTimestamp))) >= durationInterval) {
          acceptedValues.push([startTimestamp, lastTimestamp]);
        }
      }

      if (acceptedValues.length > 0) {
        allAlerts[alert.name] = {
          results: acceptedValues,
          color: alert.color,
          severity: alert.severity,
          show: Object.hasOwn(alertResults, alert.name) ? alertResults[alert.name].show : true,
        };
      } else {
        allAlerts[alert.name] = {
          results: [],
          color: null,
          severity: null,
          show: Object.hasOwn(alertResults, alert.name) ? alertResults[alert.name].show : false,
        };
      }
    }
  }
  return allAlerts;
};

const checker = (val, operation, targetValue) => {
  let check = false;
  if (operation === 'over' || operation === 'under') {
    if (operation === 'over') {
      check = val > parseFloat(targetValue.value1);
    } else {
      check = val < parseFloat(targetValue.value1);
    }
  } else {
    if (operation === 'between') {
      check = val > parseFloat(targetValue.value1) && val < parseFloat(targetValue.value2);
    } else {
      check = val < parseFloat(targetValue.value1) && val > parseFloat(targetValue.value2);
    }
  }
  return check;
};

export const alertingPlotBandsCreator = (vals: {}, alerts: any[]) => {
  const plotBands = [];
  for (const [key, values] of Object.entries(vals)) {
    const alert = alerts.find(obj => obj.name === key);
    if (alert !== undefined) {
      if (vals[key].show && alert.active) {
        vals[key].results.map((val, idx) =>
          plotBands.push({
            color: vals[key].color,
            from: val[0],
            to: val[1],
            id: `${key}${idx}`,
            borderWidth: 0,
            borderColor: '#424242',
            label: {
              text: key,
              style: {
                color: '#424242',
                fontWeight: 'bold',
                fontSize: 12,
              },
            },
          })
        );
      }
    }
  }
  return plotBands;
};

export const getMatchedMeasures = (alerts, dataset, selectedMeasures: any[]) => {
  const matchedMeasures = [];
  if (alerts.length !== 0) {
    selectedMeasures.forEach(sMeas => matchedMeasures.push(dataset.header[sMeas]));
  }
  return matchedMeasures;
};

export default chartAlertingChecker;

//ORIGINAL

// const chartAlertingChecker = (
//   data: { [key: number]: {timestamp: number; value: number}[] },
//   alerts: IAlerts[],
//   dataset: any,
//   selectedMeasures: any[]
// ) => {
//   const startTime = performance.now();
//   const selAlertMeasures = getMatchedMeasures(alerts, dataset, selectedMeasures);
//   let allAlerts = {};
//   for (let x = 0; x < alerts.length; x++) {
//     if (selAlertMeasures.includes(alerts[x].measure) && alerts[x].active) {
//       const measureIndex = dataset.header.indexOf(alerts[x].measure);
//       const dataCut = data[measureIndex];
//       // const dataCut = data.slice(data.findIndex(o => o.timestamp === alerts[x].dateCreated));
//       const acceptedValues = new Map();
//       let i = 0;
//       while (i < dataCut.length) {
//         if (checker(dataCut[i].value, alerts[x].operation, alerts[x].values) === true) {
//           let y = i + 1;
//           while (y < dataCut.length) {
//             const start = moment(dataCut[i].timestamp);
//             const end = moment(dataCut[y].timestamp);
//             const diff = moment.duration(end.diff(start)).asSeconds();
//             const durationInterval = moment.duration(alerts[x].duration.number, alerts[x].duration.unit).asSeconds();
//             const bool = checker(dataCut[y].value, alerts[x].operation, alerts[x].values);
//             let flag = false;
//             if (bool && diff >= durationInterval) {
//               acceptedValues.forEach((value, key, map) => {
//                 if (start.isBetween(moment(value[0]), moment(value[1]))) {
//                   map.set(key, [value[0], dataCut[y].timestamp]);
//                   flag = true;
//                 } else {
//                   flag = false;
//                 }
//               });
//               !flag && acceptedValues.set(start.valueOf(), [start.valueOf(), dataCut[y].timestamp]);
//               if (dataCut.length - y === 1) {
//                 i = dataCut.length;
//                 break;
//               }
//             } else if (!bool && diff >= durationInterval) {
//               acceptedValues.set(start.valueOf(), [start.valueOf(), dataCut[y - 1].timestamp]);
//               i = y;
//               break;
//             } else if (!bool && diff < durationInterval) {
//               i = y;
//               break;
//             }
//             y++;
//           }
//         }
//         i++;
//       }
//       allAlerts = {
//         ...allAlerts,
//         [alerts[x].name]: { results: Array.from(acceptedValues.values()), color: alerts[x].color, severity: alerts[x].severity },
//       };
//     }
//   }
//   const endTime = performance.now();
//   console.log("time it took:", endTime-startTime)
//   return allAlerts;
// };

// SLIDING WINDOW APPROACH

// const chartAlertingChecker = (
//   data: { [key: number]: { timestamp: number; value: number }[] },
//   alerts: IAlerts[],
//   dataset: any,
//   selectedMeasures: any[]
// ) => {
//   const startTime = performance.now();
//   const selAlertMeasuresSet = new Set(getMatchedMeasures(alerts, dataset, selectedMeasures));
//   const allAlerts = {};

//   for (const alert of alerts) {
//     if (selAlertMeasuresSet.has(alert.measure) && alert.active) {
//       const measureIndex = dataset.header.indexOf(alert.measure);
//       const dataCut = data[measureIndex];
//       const acceptedValues = [];
//       const durationInterval = moment.duration(alert.duration.number, alert.duration.unit);
//       const windowSize = durationInterval; // Set window size to the duration

//       let windowStart = 0;
//       let windowEnd = 0;
//       let inAlertPeriod = false;

//       while (windowEnd < dataCut.length) {
//         const { value, timestamp } = dataCut[windowEnd];
//         const bool = checker(value, alert.operation, alert.values);

//         // Check if the current data point meets the alert condition
//         if (bool) {
//           if (!inAlertPeriod) {
//             // Start of an alert period
//             windowStart = windowEnd;
//             inAlertPeriod = true;
//           }
//         } else {
//           if (inAlertPeriod) {
//             // End of an alert period
//             const alertDuration = moment.duration(moment(timestamp).diff(moment(dataCut[windowStart].timestamp)));
//             if (alertDuration >= durationInterval) {
//               acceptedValues.push([dataCut[windowStart].timestamp, timestamp]);
//             }
//             inAlertPeriod = false;
//           }
//         }

//         // Slide the window
//         if (moment.duration(moment(windowEnd).diff(moment(windowStart))) >= windowSize) {
//           // If the window exceeds the window size, slide it
//           inAlertPeriod = false;
//           windowStart++;
//         }

//         windowEnd++;
//       }

//       allAlerts[alert.name] = {
//         results: acceptedValues,
//         color: alert.color,
//         severity: alert.severity,
//       };
//     }
//   }
//   const endTime = performance.now();
//   console.log("time it took:", endTime-startTime)
//   return allAlerts;
// };
