// The filter code
var filterCards = (function() {
  //"use strict";

  var guestFilter = document.getElementById("guest_filter"),
    guestFilterInput = document.getElementById("guest_filter_num"),
    guestLabel = document.getElementById("guest_label"),
    bedsFilter = document.getElementById("beds_filter"),
    allBedsInputs = document.querySelectorAll("#beds_filter .beds-filter"),
    bedsLabel = document.getElementById("beds_label");

  // Get all 1-value filters (exclude multiple-choice Bedroom filters)
  var filters = Array.from(document.querySelectorAll("#filters .filter"));
  console.log("FILTERS:");
  console.log(filters);

  /** EVENT LISTENERS */

  // Since all filters behave slightly differently, we won't have a single event listener
  // but all event listeners will call runFilters(), if conditions are passed

  // CheckIn Date filter event listener (wait until date is finalized)
  document.querySelector("#FtxtMoveInDate").addEventListener(
    "blur",
    function(event) {
      console.log("CheckIn Date filter (blur) is activated");
      console.log(event.target);

      // if input is invalid, return
      if (event.target.value === "" || !event.target.value) return;

      runFilters();
    },
    false
  );

  // Guest filter event listener for input
  guestFilter.addEventListener(
    "input",
    function(event) {
      console.log("Guest filter input is activated");
      console.log(event.target);
      runFilters();
    },
    false
  );

  // Guest filter event listener for buttons
  guestFilter.addEventListener(
    "click",
    function(e) {
      console.log("Guest filter button is clicked");
      console.log(event.target);

      // to prevent dropdowns from closing on button clicks
      e.stopPropagation();

      // sanity check if not a button was clicked
      if (!event.target.matches("button")) return;

      // depending what button is clicked
      // if Done btn, just close & return
      if (event.target.classList.contains("filter-close")) {
        this.closest(".dropdown").classList.remove("open");

        // if any btns that require filters running
      } else {
        var guestNum = parseInt(guestFilterInput.value);

        // if Minus btn
        if (event.target.classList.contains("decrement-btn")) {
          console.log("Minus btn is clicked");
          if (isNaN(guestNum)) {
            guestNum = 2;
          }
          if (guestNum > 1) {
            guestNum -= 1;
            guestFilterInput.value = guestNum;
          }

          // if Plus btn
        } else if (event.target.classList.contains("increment-btn")) {
          console.log("Plus btn is clicked");
          if (isNaN(guestNum)) {
            guestNum = 0;
          }

          guestNum += 1;
          guestFilterInput.value = guestNum;

          // if Clear btn, reset input to 1 (default)
        } else if (event.target.classList.contains("filter-clear")) {
          guestFilterInput.value = 1;
          guestNum = 1;
        }

        // update label & run filters
        guestLabel.textContent = `${guestNum} Guest${guestNum > 1 ? "s" : ""}`;
        runFilters();
      }
    },
    false
  );

  // Guest filter: if user is trying to copy/paste value into input, set value to 1
  guestFilterInput.onpaste = function(e) {
    console.log("user tries to paste value in Guest input");
    guestFilter.value = 1;
    e.preventDefault();
  };

  // Bedroom filters (checkboxes) event listener
  bedsFilter.addEventListener(
    "input",
    function(event) {
      console.log("Bedrooms filter is clicked");
      console.log(event.target);

      // update label
      var activeBeds = [];
      // loop through every checkbox and create values array for all checked boxes
      Array.prototype.forEach.call(allBedsInputs, function(elem, i) {
        if (elem.checked) {
          activeBeds.push(parseInt(elem.value));
        }
      });

      // if no checked boxes or all checked, display 'Any'
      if (activeBeds.length === 0 || activeBeds.length === allBedsInputs.length) {
        bedsLabel.textContent = "Any";
      }

      // else, get number values from array and create strings for label
      else {
        activeBeds = activeBeds.map(function(bed) {
          if (bed == 0) {
            return "Studio";
          } else if (bed == 1) {
            return "1 Bed";
          } else if (bed > 1) {
            return bed + " Beds";
          } else {
            return "";
          }
        });

        // turn array into a string and insert into label
        bedsLabel.textContent = activeBeds.join(", ");
      }

      runFilters();
    },
    false
  );

  // Bedroom filters event listener for buttons
  bedsFilter.addEventListener(
    "click",
    function(e) {
      console.log("Bedrooms filter button is clicked");
      console.log(event.target);

      // to prevent dropdowns from closing on button clicks
      e.stopPropagation();

      // sanity check if not a button was clicked
      if (!event.target.matches("button")) return;

      // depending what button is clicked
      // if Done btn, just close & return
      if (event.target.classList.contains("filter-close")) {
        this.closest(".dropdown").classList.remove("open");

        // if any btns that require filters running
      } else if (event.target.classList.contains("filter-clear")) {
        // loop through every checkbox and uncheck all
        Array.prototype.forEach.call(allBedsInputs, function(elem, i) {
          elem.checked = false;
        });

        // update label & run filters
        bedsLabel.textContent = "Any";
        runFilters();
      }
    },
    false
  );

  /** Checks multiple-choice checkboxes filters, then checks all other filters,
   *  combines the result and creates criteriaArray.
   *  Passes this array to findMatches(criteriaArray).
   *  Passes the result of filtered units array into renderCard() function
   */
  function runFilters() {
    var criteriaArray = [];

    // handle MULTIPLE-CHOICE beds filter first
    var activeBeds = [];
    // loop through every checkbox and create values array for all checked boxes
    Array.prototype.forEach.call(allBedsInputs, function(elem, i) {
      if (elem.checked) {
        activeBeds.push(parseInt(elem.value));
      }
    });

    // if all checkboxes or none are checked, don't add as criteria, b/c it means 'Any'
    if (activeBeds.length > 0 && activeBeds.length < allBedsInputs.length) {
      // add this array of values in beds criteria object
      criteriaArray.push({ name: "beds", compare: "contains", val: activeBeds });
    }

    // Then loop through the rest of single-value filters to create an array of criteria objects
    var otherFiltersCriteriaArray = filters
      // this will remove date filter, if empty
      .filter(function(item) {
        return item.value !== "";
      })
      .map(function(filter) {
        return {
          name: filter.getAttribute("data-filter-name"),
          compare: filter.getAttribute("data-compare"),
          val: filter.getAttribute("data-value") ? filter.getAttribute("data-value") : filter.value
        };
      });

    // combine the result to create a final criteria array (use spread operator to merge arrays)
    criteriaArray.push(...otherFiltersCriteriaArray);

    console.log("Final CRITERIA:");
    console.log(criteriaArray);

    // Get an array of filtered units
    var filteredUnitsArray = findMatches(criteriaArray);
    console.log(filteredUnitsArray);

    // render cards by using the array of filtered units:
    renderCards(filteredUnitsArray);
  }

  // Returns Array of filteredMatches
  var findMatches = function(criteria) {
    console.log("findMatches function is called");

    // Loop through every unit
    // We want to return true if the unit matches the criteria, and false if it does not
    // This will create a new array containing only the items that returned true
    return allUnits.units.filter(function(unit) {
      // Check if unit satisfies all criteria
      // loops through every criteria for this unit to get back an array of matching criteria
      var matchingCriteriaArray = criteria.filter(function(condition) {
        // Depending on the comparison required, we'll check if the unit matches in a few different ways
        if (condition.compare === "<") {
          // if date
          if (condition.name === "date_available") {
            var filterDate = new Date(condition.val).getTime();
            var unitDate = new Date(unit.date_available).getTime();

            return unitDate <= filterDate;
          } else {
            return unit[condition.name] < condition.val;
          }
        } else if (condition.compare === ">") {
          // it's guests
          return unit[condition.name] >= condition.val;
        } else if (condition.compare === "=") {
          return unit[condition.name] == condition.val;
        } else if (condition.compare === "contains") {
          // check if unit's 'beds' value exists in criteria array of beds values e.g. val: [0, 2, 3]
          return condition.val.includes(unit[condition.name]);
        } else {
          return false;
        }
      });

      console.log(matchingCriteriaArray); // e.g. [{...}, {...}]

      // Compare the matchingCriteriaArray length to the criteria length
      // If they're the same, the unit matches all criteria
      // If not, it fails
      console.log(matchingCriteriaArray.length === criteria.length);
      return matchingCriteriaArray.length === criteria.length;
    });
  };

  // Some other unrelated filters code:
  // init
  $(document).ready(function() {
    renderCards(allUnits.units);

    // check Guests label
    var guestNum = guestFilterInput.value;
    guestLabel.textContent = `${guestNum} Guest${guestNum > 1 ? "s" : ""}`;
  });
})();

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
      var card = `<div class="card">Card<br>
                    Bedrooms: ${unitData.beds} <br>
                    Guests: ${unitData.guests} <br>
                    Checkin Date: ${unitData.date_available}</div>`;

      // append a card to the DOM
      cards.append(card);
    });
  }
}

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
      date_available: "09/01/2019",
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
      date_available: "08/30/2019",
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
      date_available: "08/29/2019",
      photo: "images/img01.jpg",
      satisfies_filter: 0,
      has_card: 0
    }
  ]
};
