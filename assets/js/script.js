var data = {};

var now = moment();
$("#currentDay").text(
    now.format('dddd, MMMM Do')
);

var createTimeBlock = function(time, text) {
    var timeBlock = $("<li>")
        .addClass("row time-block");

    var timeSpan = $("<span>")
        .addClass("col-2 col-md-1 hour pt-2")
        .text(time);

    var textInput = $("<textarea>")
        .addClass("col-8 col-sm-9 col-md-10")
        .text(text);

    var saveBtn = $("<button>")
        .addClass("col-1 saveBtn")
        .append($("<i>").addClass("far fa-save")); // save icon

    timeBlock.append(timeSpan, textInput, saveBtn);

    auditTimeBlock(timeBlock);

    $(".list-group").append(timeBlock);
}

var loadData = function() {
    data = JSON.parse(localStorage.getItem("data"));

    if (!data) {
        data = {};

        // 9am - 11am
        for (var i = 9; i <= 11; i++) {
            var time = i + "AM";
            data[time] = "";
        }
        // 12pm
        data["12PM"] = "";

        // 1pm - 5pm
        for (var i = 1; i <= 5; i++) {
            var time = i + "PM";
            data[time] = "";
        }
    }

    $.each(data, function(key, value) {
        createTimeBlock(key, value);
    });
}

var saveTasks = function() {
    localStorage.setItem("data", JSON.stringify(data));
}

var auditTimeBlock = function(timeBlock) {
    var time = $(timeBlock)
        .find("span")
        .text()
        .trim();

    time = parseInt(time);

    // make time a 24-h base
    if (time <= 5) {
        time += 12;
    }

    var currentTime = now.get("hour");

    if (time < currentTime) {
        $(timeBlock)
            .find("textarea")
            .addClass("past");
    } else if (time > currentTime) {
        $(timeBlock)
            .find("textarea")
            .addClass("future");
    } else { // time == currentTime
        $(timeBlock)
            .find("textarea")
            .addClass("present");
    }
}

loadData();