/*
Total Recall Javascript v1.0
Last Updated: 2015-03-31
Author: William R.A.D. Funk - http://Williamradfunk.com/portfolio/code/hidden-image/
*/


//Randomizes the location of the cards.
$.fn.randomizeTheDeck = function (selector) {
    var $elems = selector ? $(this).find(selector) : $(this).children(),
        $parents = $elems.parent();

    $parents.each(function () {
        $(this).children(selector).sort(function () {
            return Math.round(Math.random()) - 0.5;
        }).detach().appendTo(this);
    });

    return this;
};
//Increases the number of card picks to keep count.
function increaseClicks() {
    var NumOfClicks = $("#score_keeper").text();
    NumOfClicks = Number(NumOfClicks);
    NumOfClicks++;
    $("#score_keeper").html(NumOfClicks);
}
$(document).ready(function() {
/*browser detection - START*/
   var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "Other";
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
        },
        searchString: function (data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                this.versionSearchString = data[i].subString;

                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                }
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index === -1) {
                return;
            }

            var rv = dataString.indexOf("rv:");
            if (this.versionSearchString === "Trident" && rv !== -1) {
                return parseFloat(dataString.substring(rv + 3));
            } else {
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            }
        },

        dataBrowser: [
            {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
            {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
            {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
            {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
            {string: navigator.userAgent, subString: "Safari", identity: "Safari"},
            {string: navigator.userAgent, subString: "Opera", identity: "Opera"}
        ]

    };
    
    BrowserDetect.init();
    //document.write("You are using <b>" + BrowserDetect.browser + "</b> with version <b>" + BrowserDetect.version + "</b>");
    if (BrowserDetect.browser=="Explorer") {
     $("body").addClass("ie"); 
    }   
/*browser detection - END*/
    var timer = 2000;
    var start = false;
    var card1 = null;
    var card2 = null;
    //Shuffle the order of the li items in the ul
    $("ul").randomizeTheDeck("li");
    //Flips the card clicked on by mouse.
    $(".flip-container").click(function(event) {
        var tempHolder = $(this).prop("id");
        tempHolder = "#" + tempHolder;
        if (!($(this).hasClass("clicked")) && start == true) {
            $(this).toggleClass("clicked");
            increaseClicks();
            if (card1 == null) {
                card1 = tempHolder;
            }
            else if (card2 == null) {
                card2 = tempHolder;
                checkForMatch(card1, card2, start);
                card1 = null;
                card2 = null;
            }
        }
    });
    //At the press of the Start Game button, the cards
    //are briefly revealed and the game begins.
    $(".start_btn").click(function(event) {
        if (start === false) {
            start = true;
            timer = timer - 100;
            $(".flip-container").addClass("clicked");
            setTimeout("$('.flip-container').removeClass('clicked');", timer);
        }
        else if (start === true) {
            alert("You've already started the game.\nPress 'Reset Game' if you want to start over.");
        }
        else {alert("ERROR: start variable is neither true nor false.");}
    });
    //Resets the game and card locations to new random places.
    $(".reset_btn").click(function(event) {
        resetBoard();
    });
    //Whether manually reset, or game win, the board is reset and randomized.
    function resetBoard() {
        start = false;
        card1 = null;
        card2 = null;
        $(".flip-container").removeClass("clicked");
        $("#score_keeper").html(0);
        $("ul").randomizeTheDeck("li");
    }
    //Checks to see if the two chosen cards are a match.
    function checkForMatch(card1, card2) {
        matchCard1 = card1 + " .back";
        matchCard1 = $(matchCard1).css("background-image");
        matchCard2 = card2 + " .back";
        matchCard2 = $(matchCard2).css("background-image");
        if (matchCard1 == matchCard2) {
           $(".flip-container").each(function(index) {
               if (!($(this).hasClass("clicked"))) {
                   return false;
               }
               else if (index >= 15) {
                   alert("You win this round!\nCan you do it with less clicks?");
                   resetBoard();           
               }
           });
        }
        else {
           setTimeout(function(){ $(card1).removeClass('clicked'); }, 1000);
           setTimeout(function(){ $(card2).removeClass('clicked'); }, 1000);
        }
    }
});