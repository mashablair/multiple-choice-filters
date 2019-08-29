// The filter code
var filterCards = (function() {
  //"use strict";

  var bedsFilter = document.getElementById("beds_filter");

  // Get all filters
  var filters = Array.from(document.querySelectorAll("#filters [data-filter-name]"));
  console.log("FILTERS");
  console.log(filters);

  // Listen for changes to any filter
  document.querySelector("#filters").addEventListener(
    "input",
    function(event) {
      console.log("filter is clicked");
      console.log(event.target);

      if (!event.target.matches(".filter")) return;

      runFilters();
    },
    false
  );

  function runFilters() {
    // handle multiple-choice filters separately
    // create criteria1
    // then criteria2
    // then combine them into final criteria

    // handle beds filter
    var activeBeds = [];
    // loop through every input checkbox and create values array for all checked boxes
    var allBedsInputs = document.querySelectorAll("#beds_filter .filter");
    Array.prototype.forEach.call(allBedsInputs, function(elem, i) {
      if (elem.checked) {
        activeBeds.push(parseInt(elem.value));
      }
    });
    console.log(activeBeds);
    // // then update data-value's value with this array
    // Array.prototype.forEach.call(allBedsInputs, function(elem, i) {
    //   if (elem.checked) {
    //     elem.setAttribute('data-value', activeBeds);
    //   }
    // });

    // bedsFilter.setAttribute('data-beds-value', activeBeds); // "0,2,3"

    var criteriaBeds = { name: "beds", compare: "contains", val: activeBeds };
    console.log(criteriaBeds);

    console.log("FILTERS");
    console.log(filters);

    // Create an array of criteria from looping thru all filters
    var criteria = filters
      // first, filter criteria and only keep active filters
      .filter(function(filter) {
        return (filter.type === "checkbox" && filter.checked) || filter.type === "number" || filter.type === "text";
      })
      // then create an array of filters criteria
      .map(function(filter) {
        return {
          name: filter.getAttribute("data-filter-name"),
          compare: filter.getAttribute("data-compare"),
          val: filter.getAttribute("data-value") ? filter.getAttribute("data-value") : filter.value
        };
      });

    console.log("criteria: ");
    console.log(criteria);

    // // clean the array to remove all duplicates
    // var filteredCriteria = criteria.filter((thing, index, self) =>
    //   index === self.findIndex((t) => (
    //     t.name === thing.name
    //   ))
    // )

    console.log("FILTERED CRITERIA");
    console.log(filteredCriteria);

    // Get matches
    var matches = findMatches(filteredCriteria);
    console.log(matches);

    // render cards from main.js:
    renderCards(matches);
  }

  // Returns Array of filteredMatches
  var findMatches = function(criteria) {
    console.log("findMatches function is called");

    // We want to return true if the unit matches the criteria, and false if it does not
    // This will create a new array containing only the items that returned true
    return allUnits.units.filter(function(unit) {
      console.log(unit);

      // Check if unit satisfies all criteria
      // We'll again use the filter() method to get back an array of matching criteria
      var unitDetails = criteria.filter(function(condition) {
        console.log(condition);

        // Depending on the comparison required, we'll check if the unit matches in a few different ways
        if (condition.compare === "<") {
          return unit[condition.name] < condition.val;
        } else if (condition.compare === ">") {
          return unit[condition.name] >= condition.val;
        } else if (condition.compare === "=") {
          return unit[condition.name] == condition.val;
        } else if (condition.compare === "contains") {
          // turn condition.value string into array
          console.log("############################");
          var valuesArray = condition.val.split(",");
          console.log(unit[condition.name]);
          console.log(valuesArray.includes(unit[condition.name].toString()));
          return valuesArray.includes(unit[condition.name].toString());
        } else {
          return false;
        }
      });

      console.log(unitDetails);

      // Compare the matching unitDetails length to the criteria length
      // If they're the same, the unit matches all criteria
      // If not, it fails
      console.log(unitDetails.length === criteria.length);
      return unitDetails.length === criteria.length;
    });
  };

  // **********************
  // unrelated filters code
  var guestFilter = $("#guest_filter"),
    guestFilterInput = document.getElementById("guest_filter_num"),
    closeFilter = $(".filter-close");

  $(document).ready(function() {
    // to prevent dropdowns from closing on button clicks
    $(".dropdown-menu").click(function(e) {
      e.stopPropagation();
    });

    guestFilterInput.onpaste = function(e) {
      guestFilter.value = 1;
      e.preventDefault();
    };

    renderCards(allUnits.units);
  });

  // Minus button on Guest filter
  guestFilter.find(".remove > button").on("click", function() {
    console.log("Guest filter 'minus' button is clicked");
    var guestNum = parseInt(guestFilterInput.value);
    if (isNaN(guestNum)) {
      guestNum = 2;
    }
    if (guestNum > 1) {
      guestNum -= 1;
      guestFilterInput.value = guestNum;
    }

    runFilters();
  });

  // Plus button on Guest filter
  guestFilter.find(".add > button").on("click", function() {
    console.log("Guest filter 'plus' button is clicked");
    var guestNum = parseInt(guestFilterInput.value);
    if (isNaN(guestNum)) {
      guestNum = 0;
    }

    guestNum += 1;
    guestFilterInput.value = guestNum;

    runFilters();
  });

  // Cancel button
  closeFilter.on("click", function() {
    console.log("dropdown cancel is clicked");
    $(this)
      .closest(".dropdown")
      .removeClass("open");

    console.log(renderCards.allUnitsArray.units);
  });
})();

// my data
var allUnits = {
  formats: {
    currency: "$",
    date: "mm/dd/yyyy",
    number: "@,@@@.@@"
  },
  units: [
    {
      id: 37457808,
      name: "A3001",
      baths: 1.0,
      beds: 0,
      description: "Sweet spot in the heart of the town were you have everything around you he most trendy urban.",
      rate_per_day: 50.0,
      rate_per_week: 600.0,
      rate_per_month: 2500.0,
      sq_ft: 1930.0,
      floorplan_id: 15002001,
      floorplan_name: "Metropolitan",
      guests: 4,
      date_available: "08/08/2019",
      photo: "images/img01.jpg",
      satisfies_filter: 0,
      has_card: 0
    },
    {
      id: 37457801,
      name: "A3002",
      baths: 1.5,
      beds: 2,
      description: "Nice home in Pacific Beach with yard and space",
      rate_per_day: 90.0,
      rate_per_week: 600.0,
      rate_per_month: 2500.0,
      sq_ft: 1930.0,
      floorplan_id: 15002002,
      floorplan_name: "Urbano",
      guests: 1,
      date_available: "08/08/2019",
      photo: "images/img02.jpg",
      satisfies_filter: 0,
      has_card: 0
    },
    {
      id: 37457802,
      name: "A3003",
      baths: 2.0,
      beds: 1,
      description: "Modern apartment in urban paradise",
      rate_per_day: 150.0,
      rate_per_week: 600.0,
      rate_per_month: 2500.0,
      sq_ft: 1930.0,
      floorplan_id: 15002003,
      floorplan_name: "Urbano",
      guests: 4,
      date_available: "08/08/2019",
      photo: "images/img03.jpg",
      satisfies_filter: 0,
      has_card: 0
    },
    {
      id: 37457808,
      name: "A3001",
      baths: 1.0,
      beds: 3,
      description: "Sweet spot in the heart of the town were you have everything around you he most trendy urban.",
      rate_per_day: 50.0,
      rate_per_week: 600.0,
      rate_per_month: 2500.0,
      sq_ft: 1930.0,
      floorplan_id: 15002001,
      floorplan_name: "Metropolitan",
      guests: 4,
      date_available: "08/08/2019",
      photo: "images/img01.jpg",
      satisfies_filter: 0,
      has_card: 0
    }
  ]
};

// Some other unrelated filters code:
// init

/**
 * Builds cards based on units data in filtered allUnits array
 * @param  {Array}  data The data array or JSON file
 */
function renderCards(data) {
  console.log("building and displaying cards");

  var cards = $("#cards");

  // first, delete all cards from the container
  cards.empty();

  // if there are no units in filtered allUnits array, display the message
  if (data.length === 0) {
    cards.append("<p>There are no apartments matching your search.</p>");
  }

  // Otherwise, display the cards based on filter values
  else {
    // Loop through each item in filtered allUnits array (our data) and create a card for each unit
    data.forEach(function(unitData, unit) {
      // for each item in filtered allUnits data, create a card string and fill out the info w/ data details
      var card = `<div class="card">Card<br>Bedrooms: ${unitData.beds} <br>Guests: ${unitData.guests}</div>`;

      // append a card to the DOM
      cards.append(card);
    });
  }
}
