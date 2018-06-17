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

  var database = firebase.database();


  $("#add-train").on("click", function(){
    event.preventDefault();

    database.ref().push({
        trainName: $("#train-name").val().trim() ,
        destination: $("#destination").val().trim(),
        firstTrain: $("#first-train").val().trim(),
        trainFrequency: $("#train-frequency").val().trim(),
      });

  });

  database.ref().on("child_added", function(snapshot){
    event.preventDefault();
    
    // let  tFrequency = 3;
    //     // Difference between the times
        let diffTime = moment().diff(moment(snapshot.val().firstTrain), "HH/MM");
        console.log("DIFFERENCE IN TIME: " + diffTime);

    $("tbody").append("<tr><br>"+
    "<td>"+snapshot.val().trainName+"</td><br>"+
    "<td>"+snapshot.val().destination+"</td><br>"+
    "<td>"+snapshot.val().trainFrequency+"</td><br>")
    // "<td>"+nextArrival+"</td><br>"+
    // "<td>"+minutesAway+"<td><br>")
  });


console.log(moment().format("DD/MM/YY hh:mm A"));