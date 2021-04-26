var data = {};

var now = moment();
var formatNow = now.format('dddd, MMMM Do');
$("#currentDay").text(formatNow);

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

var saveData = function() {
    localStorage.setItem("data", JSON.stringify(data));
}

var clearData = function() {
    localStorage.clear();
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

$(".list-group").on("click", "button", function() {
    var timeBlock = $(this).closest(".time-block");

    var time = timeBlock
        .find("span")
        .text();

    var textInput = timeBlock
        .find("textarea")
        .val()
        .trim();
    
    data[time] = textInput;
    saveData();
});

loadData();

var gap = function() {
    var now = moment();
    var midNight = moment().set("hour", 23); // 11pm
    // var midNight = moment().add(15, "s");

    var nowMilli = now.hour() * 60 * 60 * 1000 +
        now.minute() * 60 * 1000 +
        now.second() * 1000 +
        now.millisecond();

    var midNightMilli = midNight.hour() * 60 * 60 * 1000 +
        midNight.minute() * 60 * 1000 +
        midNight.second() * 1000 +
        midNight.millisecond();

    return midNightMilli - nowMilli;
}

setTimeout(function() {
    clearData();
    location.reload();
}, gap());

setInterval(function() {
    $(".time-block").each(function(index, e) {
        auditTimeBlock(e);
    });
}, 30 * 60 * 1000);