import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import { remove } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgvZFHAQeTBZYtS6OJ_lSvvosV_JN2sPc",
    authDomain: "webfitlog.firebaseapp.com",
    projectId: "webfitlog",
    storageBucket: "webfitlog.appspot.com",
    messagingSenderId: "471149415032",
    appId: "1:471149415032:web:a05386b2d086e86f513b8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//===========================================================================================

let foodItems = {}; // Stores food items and their calorie/protein values
let selectedFood = null; // Currently selected food item
let DBnowDateYMD = null; //contains current date
let DBnowDateYear = null;
let DBnowDateMonth = null;
let DBnowDateDay = null;
let DBnowTime = null;
let DBnowRaw = null;
let TransStartDate = 0;
let daysSinceStarted = 0;
let weeksSinceStarted=0;
let ProgressTodayCal=0;
let ProgressTodayPro=0;
let previousUpdatedWeight=0;
updateDateTime(); // Initialize the date and time display







//====================================================================================================== T O P =======================================================================================================


//Function to get days since log started by counting the number of data inside foodLog in BD
function countDaysSinceStarted() // TOP
{   
    const daySinceStarted = ref(db, 'UserGoals/transformationStartDate');
    onValue(daySinceStarted, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            TransStartDate = data;
        }
    });

    daysSinceStarted = calculateDaysElapsed(TransStartDate);
    document.getElementById('daysSS').textContent = daysSinceStarted;
}




// function to show the progress percentage on the FE
function setProgress()
{
    const progressPercentage = (Math.abs(((getCurrentWeightFromDB()-getStartingWeightFromDB())/(getWeightTargetFromDB()-getStartingWeightFromDB()))*100)).toFixed(0);
    document.getElementById('progPercentage').textContent = progressPercentage;
}

function setWeekProgress()
{
    weeksSinceStarted = Math.ceil(daysSinceStarted / 7);
    const WeekProgressPercentage = (((weeksSinceStarted)/(getTransDuration())*100)).toFixed(0);
    document.getElementById('progWeekPercentage').textContent = WeekProgressPercentage;
}


// Function to calculate the number of week since log started
function countWeeksSinceStarted() //Top
{
    weeksSinceStarted = Math.ceil(daysSinceStarted / 7);
    document.getElementById('weekSS').textContent = weeksSinceStarted;
}


document.getElementById('showResetBtn').addEventListener('click', function() 
{
    document.getElementById('resetGoalStart').classList.remove('hidden');
});







//goals popup============================================================================

document.getElementById('openSetGoals').addEventListener('click', function() 
{
        // document.getElementById('setGoalsForm').classList.remove('hidden');
        var popup = document.getElementById('setGoalsForm');
    popup.classList.remove('hidden');
    popup.style.opacity = 0; // Start with opacity 0
    popup.style.top = '10px'; // Start position

    // Timeout to allow CSS to catch up
    setTimeout(function() {
        popup.style.opacity = 1; // End with full opacity
        popup.style.top = '170px'; // End position
    }, 10); // Small delay








            // Function to submit goals to Firebase
        document.getElementById('submitGoals').addEventListener('click', function() 
        {
            const weightTarget = parseFloat(document.getElementById('weightTarget').value);
            const dailyCalorieTarget = parseFloat(document.getElementById('dailyCalorieTarget').value);
            const dailyProteinTarget = parseFloat(document.getElementById('dailyProteinTarget').value);
            const weektarget = parseFloat(document.getElementById('weekTarget').value);
            const startWeight = parseFloat(document.getElementById('StartingWeight').value);
            const currentWeight = parseFloat(document.getElementById('currentWeight').value);

            // if (!isNaN(weightTarget) && !isNaN(dailyCalorieTarget) && !isNaN(dailyProteinTarget)) {
            //     const userGoalsRef = ref(db, 'UserGoals');
            //     set(userGoalsRef, { weightTarget, dailyCalorieTarget, dailyProteinTarget });
            //     document.getElementById('setGoalsForm').classList.add('hidden');
            //     // Reset form fields
            //     document.getElementById('weightTarget').value = '';
            //     document.getElementById('dailyCalorieTarget').value = '';
            //     document.getElementById('dailyProteinTarget').value = '';
            // } else {
            //     alert('Please enter valid goals.');
            // }

            
            if (!isNaN(weightTarget))
            {
                const userGoalsRef = ref(db, 'UserGoals/weightTarget');
                set(userGoalsRef, weightTarget);
                document.getElementById('setGoalsForm').classList.add('hidden');
                // Reset form fields
                document.getElementById('weightTarget').value = '';
            } 
            if (!isNaN(dailyCalorieTarget))
            {
                const userGoalsRef = ref(db, 'UserGoals/dailyCalorieTarget');
                set(userGoalsRef, dailyCalorieTarget);
                document.getElementById('setGoalsForm').classList.add('hidden');
                // Reset form fields
                document.getElementById('dailyCalorieTarget').value = '';
            } 
            if (!isNaN(dailyProteinTarget))
            {
                const userGoalsRef = ref(db, 'UserGoals/dailyProteinTarget');
                set(userGoalsRef, dailyProteinTarget);
                document.getElementById('setGoalsForm').classList.add('hidden');
                // Reset form fields
                document.getElementById('dailyProteinTarget').value = '';
            } 
            if (!isNaN(weektarget))
            {
                const userGoalsRef = ref(db, 'UserGoals/transformationDuration');
                set(userGoalsRef, weektarget);
                document.getElementById('setGoalsForm').classList.add('hidden');
                // Reset form fields
                document.getElementById('weektarget').value = '';
            } 
            if (!isNaN(startWeight))
            {
                const setStartWeightRef = ref(db, 'UserGoals/startingWeight');
                set(setStartWeightRef, startWeight);
                document.getElementById('setGoalsForm').classList.add('hidden');
                // Reset form fields
                document.getElementById('startWeight').value = '';
            } 
            if (!isNaN(currentWeight))
            {
                const previousUpdatedWeight2=getCurrentWeightFromDB();
               
                const setCurrentWeightRef = ref(db, 'UserGoals/currentWeight');
                const setpreviouslyUpdatedWeightRef = ref(db, 'UserGoals/previousUpdatedWeight');
                set(setCurrentWeightRef, currentWeight);
                set(setpreviouslyUpdatedWeightRef, previousUpdatedWeight2);
                document.getElementById('setGoalsForm').classList.add('hidden');
                // Reset form fields
                document.getElementById('currentWeight').value = '';
            } 
            // else 
            // {
            //     // alert('Please enter valid inputs.');
            // }


        });

        document.getElementById('resetGoalStart').addEventListener('click', function() 
        {
            const userGoalsRef = ref(db, 'UserGoals/transformationStartDate');
            const transStartDate = DBnowDateYMD;
            set(userGoalsRef, transStartDate);


            document.getElementById('resetGoalStart').classList.remove('resetGoaldate');
            document.getElementById('resetGoalStart').classList.add('resetGoaldatehdn');
        });

        // Function to cancel setting goals popup
        document.getElementById('cancelGoals').addEventListener('click', function() 
        {
            document.getElementById('setGoalsForm').classList.add('hidden');
            // Reset form fields
            document.getElementById('weightTarget').value = '';
            document.getElementById('dailyCalorieTarget').value = '';
            document.getElementById('dailyProteinTarget').value = '';
            document.getElementById('weekTarget').value = '';
            document.getElementById('startWeight').value = '';
            document.getElementById('currentWeight').value = '';
            document.getElementById('resetGoalStart').classList.remove('resetGoaldatehdn');
            document.getElementById('resetGoalStart').classList.add('resetGoaldate');
            document.getElementById('resetGoalStart').classList.add('hidden');
        });
});

//goalos popup ends============================================================================


//================================================================================================== T O P    E N D ==================================================================================================






//====================================================================================================== M I D =======================================================================================================

// Function to fetch and display food items from the database on the list
function fetchAndDisplayFoodItems() // Mid
{
    const foodItemsRef = ref(db, 'foodItems');
    onValue(foodItemsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            foodItems = data; // Update local foodItems object
            updateFoodDropdown(); // Update dropdown on the page
            updateExistingFoodItemsList(); // Update list in the popup
        }
    });
}


// Function to Edit/delete food items 
function updateExistingFoodItemsList() // Mid
{
    const listContainer = document.getElementById('existingFoodItemsList');
    listContainer.innerHTML = ''; // Clear existing list
    for (const foodName in foodItems) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'food-item';

        const nameLabel = document.createElement('span');
        nameLabel.textContent = foodName;
        itemDiv.appendChild(nameLabel);

        const caloriesInput = document.createElement('input');
        caloriesInput.type = 'number';
        caloriesInput.value = foodItems[foodName].caloriesPerGram;
        caloriesInput.disabled = true;
        itemDiv.appendChild(caloriesInput);

        const proteinInput = document.createElement('input');
        proteinInput.type = 'number';
        proteinInput.value = foodItems[foodName].proteinPerGram;
        proteinInput.disabled = true;
        itemDiv.appendChild(proteinInput);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => toggleEdit(foodName, caloriesInput, proteinInput);
        itemDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteFoodItem(foodName);
        itemDiv.appendChild(deleteButton);

        listContainer.appendChild(itemDiv);
    }
}


// Function for and to toggle the edit button when managing food items
function toggleEdit(foodName, caloriesInput, proteinInput) // Mid
{
    const isEditable = !caloriesInput.disabled;
    caloriesInput.disabled = isEditable;
    proteinInput.disabled = isEditable;

    if (isEditable) {
        // Update the food item in the database
        updateFoodItem(foodName, parseFloat(caloriesInput.value), parseFloat(proteinInput.value));
    }
}

// Function to delete an existing food item
function deleteFoodItem(foodName) // Mid
{
    if (confirm(`Are you sure you want to delete ${foodName}?`)) {
        const foodItemRef = ref(db, `foodItems/${foodName}`);
        remove(foodItemRef).then(() => {
            alert(`${foodName} has been deleted.`);
            fetchAndDisplayFoodItems(); // Refresh the food items list
        }).catch((error) => {
            console.error("Error deleting food item: ", error);
        });
    }
}


// Update food dropdown on the page
function updateFoodDropdown() // Mid
{
    const dropdown = document.getElementById('foodItemDropdown');
    // Clear existing options except the first
    dropdown.options.length = 1; 
    for (const foodName in foodItems) {
        const option = new Option(foodName, foodName);
        dropdown.add(option);
    }
    // Always add the "Add New Item" option at the end
    dropdown.add(new Option("~ Manage Items ~", "addNewItem"));
}


// Function to add food item to the database
function addFoodItemToDB(foodName, caloriesPerGram, proteinPerGram) // Mid
{
    const foodItemRef = ref(db, `foodItems/${foodName}`);
    set(foodItemRef, { caloriesPerGram, proteinPerGram });
}



// function updateFoodItem(foodName, caloriesPerGram, proteinPerGram) //duplicate. doesnt work
// {
//     const foodItemRef = ref(db, `foodItems/${foodName}`);
//     set(foodItemRef, { caloriesPerGram, proteinPerGram });
// }

// Event listener for food item dropdown
document.getElementById('foodItemDropdown').addEventListener('change', function() // Mid
{
    const selectedValue = this.value;
    if (selectedValue === 'addNewItem') {
        editFoodItems(); // Call the function to add a new food item
    } else {
        selectedFood = selectedValue; // Set the selected food item
    }
});



// Add food consumption to the database
function addFoodConsumption() // Mid
{
    if (!selectedFood) {
        alert('Please select a food item.');
        return;
    }

    const amount = parseFloat(document.getElementById('foodAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    updateDateTime();
    const foodData = foodItems[selectedFood];
    const calories = amount * foodData.caloriesPerGram;
    const protein = amount * foodData.proteinPerGram;

    const foodLogRef = ref(db, `foodLog/${DBnowDateYMD}/${selectedFood}`);
    onValue(foodLogRef, (snapshot) => {
        const data = snapshot.val() || { totalCalories: 0, totalProtein: 0 };
        data.totalCalories += calories;
        data.totalProtein += protein;
        set(foodLogRef, data);
    }, { onlyOnce: true });

    document.getElementById('foodAmount').value = '';
    document.getElementById('foodItemDropdown').selectedIndex = 0;
    selectedFood = null; // Reset the selected food
}



// Edit food items functionality and makes the managing food form visible
function editFoodItems()   // Mid
{
    document.getElementById('addFoodForm').classList.remove('hidden');
}

// Event listener for adding a new food item from the form
document.getElementById('submitNewFood').addEventListener('click', function() // Mid
{
    const foodName = document.getElementById('newFoodName').value;
    const caloriesPerGram = parseFloat(document.getElementById('newCaloriesPerGram').value);
    const proteinPerGram = parseFloat(document.getElementById('newProteinPerGram').value);

    if (foodName && !isNaN(caloriesPerGram) && !isNaN(proteinPerGram)) {
        addFoodItemToDB(foodName, caloriesPerGram, proteinPerGram);
        document.getElementById('addFoodForm').classList.add('hidden');
        // Reset form fields
        document.getElementById('newFoodName').value = '';
        document.getElementById('newCaloriesPerGram').value = '';
        document.getElementById('newProteinPerGram').value = '';
    } 
    else 
    {
        alert('Please enter valid details.');
    }
});



// Event listener for canceling the add food item action
document.getElementById('cancelNewFood').addEventListener('click', function() // Mid
{
    document.getElementById('addFoodForm').classList.add('hidden');
    // Reset form fields
    document.getElementById('newFoodName').value = '';
    document.getElementById('newCaloriesPerGram').value = '';
    document.getElementById('newProteinPerGram').value = '';
});



// Function to update today's stats to show on the FE
function updateTodaysStats() // Mid
{
    // 
    updateDateTime;
    const date = DBnowDateYMD;
    const dayLogRef = ref(db, `foodLog/${date}`);
    onValue(dayLogRef, (snapshot) => {
        const data = snapshot.val();
        let totalCalories = 0, totalProtein = 0;
        for (const food in data) {
            totalCalories += data[food].totalCalories;
            totalProtein += data[food].totalProtein;
        }
        ProgressTodayCal=totalCalories;
        ProgressTodayPro=totalProtein;

        document.getElementById('todaysCalories').textContent = totalCalories.toFixed(1);
        document.getElementById('todaysProtein').textContent = totalProtein.toFixed(1);
    });
}



function GetAverageFromStartDate() {
    let totalCalories = 0;
    let totalProtein = 0;
    let daysCounted = 0;
    let avgCalories = 0;
    let avgProtein = 0;

    // Get the transformation start date
    const transStartDateRef = ref(db, 'UserGoals/transformationStartDate');
    onValue(transStartDateRef, (snapshot) => {
        const transStartDate = snapshot.val();
        if (transStartDate) {
            const startDate = new Date(transStartDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            // Iterate over each day from start date to yesterday
            for (let d = startDate; d <= yesterday; d.setDate(d.getDate() + 1)) {
                const dateStr = formatDate(d);
                const dayLogRef = ref(db, `foodLog/${dateStr}`);
                onValue(dayLogRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        for (const food in data) {
                            totalCalories += data[food].totalCalories;
                            totalProtein += data[food].totalProtein;
                        }
                        daysCounted++;
                    }

                    // Calculate averages
                    if (daysCounted > 0) {
                        avgCalories = totalCalories / daysCounted;
                        avgProtein = totalProtein / daysCounted;
                    }
                }, { onlyOnce: true });
            }
        }
    });

    // // Store the averages in variables
    // let averageCaloriesPerDay = avgCalories;
    // let averageProteinPerDay = avgProtein;

    document.getElementById('AvgCalPday').textContent = avgCalories.toFixed(0);
    document.getElementById('AvgPrtPday').textContent = avgProtein.toFixed(0);

    // You can use these variables as needed
}







// Function to update other stats (yesterday's, this week's, last week's)
function updateYesterdaysStats() //have to fix=======================================Fixed
{ 
    updateDateTime();
    let yesterday = DBnowRaw;
    const yesterdayx = DBnowRaw;
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = formatDate(yesterday);

    const dayLogRef = ref(db, `foodLog/${dateStr}`);
    onValue(dayLogRef, (snapshot) => {
        const data = snapshot.val();
        let totalCalories = 0, totalProtein = 0;
        if (data) {
            for (const food in data) {
                totalCalories += data[food].totalCalories;
                totalProtein += data[food].totalProtein;
            }
        }
        document.getElementById('yesterdaysCalories').textContent = totalCalories.toFixed(1); 
        document.getElementById('yesterdaysProtein').textContent = totalProtein.toFixed(1);
    });
}




function getStartAndEndOfWeek(date) 
{
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    return { start, end };
}




function updateThisWeeksStats()
{
    const { start, end } = getStartAndEndOfWeek(new Date());
    calculateWeeklyStats(start, end, 'thisWeeksAvgCalories', 'thisWeeksAvgProtein');
}




function updateLastWeeksStats() 
{
    const now = new Date();
    const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const { start, end } = getStartAndEndOfWeek(lastWeek);
    calculateWeeklyStats(start, end, 'lastWeeksAvgCalories', 'lastWeeksAvgProtein');
}

function calculateWeeklyStats(start, end, caloriesElementId, proteinElementId) {
    let totalCalories = 0, totalProtein = 0, daysCounted = 0;
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const dayLogRef = ref(db, `foodLog/${dateStr}`);
        onValue(dayLogRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                for (const food in data) {
                    totalCalories += data[food].totalCalories;
                    totalProtein += data[food].totalProtein;
                }
                daysCounted++;
                if (daysCounted === 7) {
                    const avgCalories = (totalCalories / daysCounted).toFixed(2);
                    const avgProtein = (totalProtein / daysCounted).toFixed(2);
                    document.getElementById(caloriesElementId).textContent = avgCalories;
                    document.getElementById(proteinElementId).textContent = avgProtein;
                }
            }
        }, { onlyOnce: true });
    }
}

function setWtChangeSinceDayOne()
{
    const wtChngSinceDayOne = (getCurrentWeightFromDB()-getStartingWeightFromDB()).toFixed(0);
    document.getElementById('wtChngSinceDayOne').textContent = wtChngSinceDayOne;
    
    const wtChangeSinceLastUpdate = (getCurrentWeightFromDB()-getLastUpdatedWeightFromDB()).toFixed(0);
    document.getElementById('wtChangeSinceLastUpdate').textContent =wtChangeSinceLastUpdate;
}





function updateStats() 
{
    updateTodaysStats();
    updateYesterdaysStats();
    updateThisWeeksStats();
    updateLastWeeksStats();
    updateProgressBars();
    updateWeightData();
    setWtChangeSinceDayOne();
    setWeekProgress();
}
//===================================================================================================== M I D    E N D======================================================================================================











//====================================================================================================== B O T T O M =======================================================================================================




//================================================================================================== B O T T O M    E N D ==================================================================================================










//====================================================================================================== HELPER FUNCTIONS =======================================================================================================



// Gets and sets current time and date
function updateDateTime() 
{
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    DBnowRaw = now;
    DBnowDateYear = year;
    DBnowDateMonth = month;
    DBnowDateDay = day;
    DBnowDateYMD = `${year}-${month}-${day}`;
    const dateString = now.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
    const timeString = now.toLocaleTimeString();
    DBnowTime = timeString;
   // document.getElementById('currentDateTime').textContent = DBnowDateYMD + ' ' + timeString; //this displays it on the page
    
}

function formatDate(dt) {
    const now = dt;
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
   
    let retdt = `${year}-${month}-${day}`;
    return retdt;
}


function reverseFormat_Day(YMD)
{
    const date = new Date(YMD);
    return date.getDate(); // Returns the day of the month (dd) from the date

}


function calculateDaysElapsed(startDate) {
    const startDateObj = new Date(startDate);
    const today = new Date();

    // Set the time of both dates to 00:00:00 for accurate day comparison
    startDateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDifference = today - startDateObj;
    const daysElapsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysElapsed;
}



function getTransDuration()
{
    let TransDuration = 0;
    const TransDurationRef = ref(db, 'UserGoals/transformationDuration');
    onValue(TransDurationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            TransDuration = data;
        }
    });

    return TransDuration;

}

function getCurrentWeightFromDB()
{
    let CurrentWeighttDB = 0;
    const weightTargetDBRef = ref(db, 'UserGoals/currentWeight');
    onValue(weightTargetDBRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            CurrentWeighttDB = data;
        }
    });

    return CurrentWeighttDB;

}


function getLastUpdatedWeightFromDB()
{
    let lastWeighttDB = 0;
    const lastweightTargetDBRef = ref(db, 'UserGoals/previousUpdatedWeight');
    onValue(lastweightTargetDBRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            lastWeighttDB = data;
        }
    });

    return lastWeighttDB;

}


function getStartingWeightFromDB()
{
    let StartingWeighttDB = 0;
    const startingweightDBRef = ref(db, 'UserGoals/startingWeight');
    onValue(startingweightDBRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            StartingWeighttDB = data;
        }
    });

    return StartingWeighttDB;

}


function getWeightTargetFromDB()
{
    let weightTargetDB = 0;
    const weightTargetDBRef = ref(db, 'UserGoals/weightTarget');
    onValue(weightTargetDBRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            weightTargetDB = data;
        }
    });

    return weightTargetDB;

}

//==================================================================================================== HELPER FUNCTIONS ENDS ====================================================================================================







// Select a food item
function selectFood(foodName) //NA
{
    selectedFood = foodName;
}













//progress bar============================================================================
let userGoals = { dailyCalorieTarget: 0, dailyProteinTarget: 0 };
let userWeightGoals = { weightTarget: 0};


// Fetch goals from Firebase
const userGoalsRef = ref(db, 'UserGoals');
onValue(userGoalsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        userGoals = data;
        updateStats(); // Update stats to refresh progress bars
    }
});

const weightGoalsRef = ref(db, 'UserGoals');
onValue(weightGoalsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        userWeightGoals = data;
        updateStats(); // Update stats to refresh progress bars
    }
});



// Function to update progress bars
function updateProgressBars() {
    const calorieProgress = document.getElementById('calorieProgress');
    const proteinProgress = document.getElementById('proteinProgress');

    let caloriePercentage = 0;
    let proteinPercentage = 0;

    if (userGoals.dailyCalorieTarget >= 0) {
        caloriePercentage = (ProgressTodayCal / userGoals.dailyCalorieTarget) * 100;
    }

    if (userGoals.dailyProteinTarget >= 0) {
        proteinPercentage = (ProgressTodayPro / userGoals.dailyProteinTarget) * 100;
    }

    calorieProgress.style.width = Math.min(caloriePercentage, 100) + '%';
    // calorieProgress.textContent = Math.min(caloriePercentage, 100).toFixed(2) + '%';

    proteinProgress.style.width = Math.min(proteinPercentage, 100) + '%';
    // proteinProgress.textContent = + ((ProgressTodayPro / userGoals.dailyProteinTarget) * 100).toFixed(2) + '%';
}


//progress bar ends============================================================================
 


//WeightStat==================================================================================

function updateWeightData()
{
    const weightTrgt = getCurrentWeightFromDB();

    document.getElementById('wttrgt').textContent = weightTrgt;

}

//WeightStat ends==================================================================================



//document.getElementById('editFoodItems').addEventListener('click', editFoodItems);
document.getElementById('addFood').addEventListener('click', addFoodConsumption);
document.getElementById('addFood').addEventListener('click', updateStats);
setInterval(countDaysSinceStarted, 1000);
setInterval(countWeeksSinceStarted, 1000);
setInterval(GetAverageFromStartDate, 60000);  //changed 3:12 ==================================================================================
setInterval(setProgress, 1000);
setInterval(updateStats, 1000); // Update stats every minute
fetchAndDisplayFoodItems(); // Fetch food items when the page loads
setInterval(updateDateTime, 1000);




/*
if i have to pass a value to the FE from the BE:

document.getElementById('currentDateTime').textContent = DBnowDateYMD + ' ' + timeString; 

here 'currentDateTime' is an ide if the location the text is goint to be visible. for example <div id="currentDateTime" class="dateTimeDisplay"></div>



    <div id="currentDateTime" class="dateTimeDisplay"></div>



*/