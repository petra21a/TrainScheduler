    // 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyBQA1RFr2RBUyCOLbpl9dfV51J8kpRH8zI",
  authDomain: "ejohnsonstartingproject.firebaseapp.com",
  databaseURL: "https://ejohnsonstartingproject.firebaseio.com",
  projectId: "ejohnsonstartingproject",
  storageBucket: "ejohnsonstartingproject.appspot.com",
  messagingSenderId: "1087153459167"
  };

  firebase.initializeApp(config);

  let database = firebase.database();
  let keyList =[];
  let trainLocalCopy=[];

  let addTrain = function(trainName,destination,firstTrain,trainFrequency,lastUpdated){
    trainLocalCopy.push({trainName,destination,firstTrain,trainFrequency,lastUpdated});
  };


  $("#add-train").on("click", function(){
    event.preventDefault();

    let newTrain = database.ref().push({
        trainName: $("#train-name").val().trim() ,
        destination: $("#destination").val().trim(),
        firstTrain: $("#first-train").val().trim(),
        trainFrequency: $("#train-frequency").val().trim(),
        lastUpdated: moment().format("HH:mm"),
      });

  });

  database.ref().on("child_added", function(snapshot){
    event.preventDefault();
    // Logic from Activity 17 and 21 almost verbatim
    addTrain(snapshot.val().trainName,snapshot.val().destination,snapshot.val().firstTrain,snapshot.val().trainFrequency,snapshot.val().lastUpdated);
    console.log(snapshot.val().trainName.split(" ").join("-").toLowerCase());

    let firstTimeConverted = moment(snapshot.val().firstTrain, "HH:mm").subtract(1, "years");
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    let tRemainder = diffTime % snapshot.val().trainFrequency;
    let minutesAway = snapshot.val().trainFrequency - tRemainder;
    let nextArrival = moment().add(minutesAway, 'm');

    let newTrain = $("<tr>");
    newTrain.attr("id", "train-"+snapshot.val().trainName.split(" ").join("-").toLowerCase()).append(
    "<td>"+snapshot.val().trainName+"</td><br>"+
    "<td>"+snapshot.val().destination+"</td><br>"+
    "<td>"+snapshot.val().trainFrequency+"</td><br>"+
    "<td>"+moment(nextArrival).format("HH:mm")+"</td><br>"+
    "<td>"+minutesAway+"<td><br>");
    $("tbody").append(newTrain);

    keyList.push(snapshot.key);
    // console.log(snapshot.key);
    // console.log(keyList);
  
// });
//   database.ref().on("child_changed", function(snapshot){
//     console.log(snapshot);
//     // Logic from Activity 17 and 21 almost verbatim
//     let firstTimeConverted = moment(snapshot.val().firstTrain, "HH:mm").subtract(1, "years");
//     let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
//     let tRemainder = diffTime % snapshot.val().trainFrequency;
//     let nextArrival = snapshot.val().trainFrequency - tRemainder;
//     let minutesAway = moment().add(nextArrival, 'm');
    
//     $("#"+snapshot.val().trainName).html(
//         "<td>"+snapshot.val().trainName+"</td><br>"+
//         "<td>"+snapshot.val().destination+"</td><br>"+
//         "<td>"+snapshot.val().trainFrequency+"</td><br>"+
//         "<td>"+moment(minutesAway).format("HH:mm")+"</td><br>"+
//         "<td>"+nextArrival+"<td><br>");
  
});

// for (let n of keyList){
// database.ref().child(n).update({
//      lastUpdated : moment().format("HH:mm"),
     
//     });
// };

let scheduleUpdate = function(){
    for(i=0;i<trainLocalCopy.length;i++){
        let firstTimeConverted = moment(trainLocalCopy[i].firstTrain, "HH:mm").subtract(1, "years");
        let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        let tRemainder = diffTime % trainLocalCopy[i].trainFrequency;
        let minutesAway = trainLocalCopy[i].trainFrequency - tRemainder;
        let nextArrival = moment().add(minutesAway, 'm');

        $("#train-"+trainLocalCopy[i].trainName.split(" ").join("-").toLowerCase()).fadeOut("slow").html(
            "<td>"+trainLocalCopy[i].trainName+"</td><br>"+
            "<td>"+trainLocalCopy[i].destination+"</td><br>"+
            "<td>"+trainLocalCopy[i].trainFrequency+"</td><br>"+
            "<td>"+moment(nextArrival).format("HH:mm")+"</td><br>"+
            "<td>"+minutesAway+"<td><br>").fadeIn("slow");
    }
    setTimeout(scheduleUpdate, 60000);
};
scheduleUpdate();
