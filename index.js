const todayDate = new Date();
console.log(todayDate);

let date = '';
let date1;
let date2;

const monthDay = {
    0 : 31,
    1 : 28,
    2 : 31,
    3 : 30,
    4 : 31,
    5 : 30,
    6 : 31,
    7 : 31,
    8 : 30,
    9 : 31,
    10 : 30,
    11 : 31
};

const url = 'https://www.gov.uk/bank-holidays.json';

function yesterday() {
    document.getElementById("customDate").style.display = 'none';
    
    let dateNow = todayDate.getDate();
    let lastmonth = todayDate.getMonth();
    let year = todayDate.getFullYear();

    console.log(lastmonth);
    if(dateNow == 1){
        if(lastmonth == 0) {
            lastmonth = 11;
            year -= 1;
            dateNow = monthDay[lastmonth];
        }else {
            dateNow = monthDay[lastmonth-1];
            lastmonth -= 1;
        }
    }else {
        dateNow -= 1;
    }

    date = `${lastmonth+1}-${dateNow}-${year}`;
    console.log(date);
    date1 = new Date(date);
    console.log(date1);
    clearTable();
    getApi(url, date1, todayDate);
    date = '';
}

function lastWeek() {
    document.getElementById("customDate").style.display = 'none';
    let day = todayDate.getDay();
    let dateNow = todayDate.getDate();
    let lastmonth = todayDate.getMonth();
    let year = todayDate.getFullYear();
    if(day > 0) {
        if(dateNow > day) {
            dateNow -= day;
            if(dateNow > 7){
                dateNow -= 7;
            }else {
                let dayLeft = 7 - dateNow;
                if(lastmonth == 0) {
                    lastmonth = 12;
                    year -= 1;
                }
                dateNow = monthDay[lastmonth-1];
                dateNow -= dayLeft;
            }
        }
    }
    date = `${lastmonth}-${dateNow}-${year}`;
    date1 = new Date(date);
    clearTable();
    getApi(url, date1, todayDate);
    date = '';
}

function lastMonth() {
    document.getElementById("customDate").style.display = 'none';
    let lastmonth = todayDate.getMonth();
    console.log(lastmonth);
    let year = todayDate.getFullYear();
    if (lastmonth == 0) {
        lastmonth = 12;
        year -= 1;
    }
    date = `${lastmonth}-01-${year}`;
    console.log(lastmonth);
    date1 = new Date(date);
    console.log(date1);
    clearTable();
    getApi(url, date1, todayDate);
    date = '';
}

function customDate() {
    document.getElementById("customDate").style.display = 'block';
    document.getElementById("holidays").style.display = 'none';
    let findButton = document.getElementById('find');
    console.log(findButton);
    clearTable();
    // if (!findButton) {
    //     let button = document.createElement('button');
    //     button.textContent = "Find Holidays..";
    //     button.id = "find";
    //     let ele = document.getElementById('customDate');
    //     ele.appendChild(button);
    // }
    // findButton = document.getElementById('find');
    // console.log(findButton);
    date = document.getElementById("firstDate").value;
    console.log(date);
    date1 = new Date(date);
    console.log(date1);
    date = document.getElementById("secondDate").value;
    console.log(date);
    date2 = new Date(date);
    console.log(date2);
    console.log(date1 > date2);
}

function showCustomInput(){
    document.getElementById("customDate").style.display = 'block';
    document.getElementById("holidays").style.display = 'none';
}

function findHoliday(){
    customDate();
    if(date == '') {
        //console.log("Enter correct dates!!");
        return;
    }    
    else {
        getApi(url, date1, date2);
    }
}

async function getApi(url, date1, date2) {
    const response = await fetch(url);
    const data = await response.json();
    //document.getElementById("customDate").style.display = 'none';
    //document.getElementById("holidays").innerHTML = data;
    if (response) {
        searchData(data, date1, date2);
    }
}

async function searchData(data, date1, date2) {
    //console.log(date1);
    let eng_wales = data['england-and-wales'].events.filter((obj) => {
        let newDate = new Date(obj.date);
        console.log(newDate);
        //console.log(newDate > date1);
        // console.log(newDate >= date1);
        // console.log(newDate <= date2);
        return (newDate >= date1 && newDate <= date2);
    });

    console.log(eng_wales.length);
    let scotland = data.scotland.events.filter((obj) => {
        let newDate = new Date(obj.date);
        console.log(newDate);
        return (newDate >= date1 && newDate <= date2);
    });
    console.log(scotland.length);
    let northIre = data['northern-ireland'].events.filter((obj) => {
        let newDate = new Date(obj.date);
        console.log(newDate);
        return (newDate >= date1 && newDate <= date2);
    });
    console.log(northIre.length);
    await showData(eng_wales);
    await showData(scotland);
    await showData(northIre);
}

function showData(arr) {
    document.getElementById('holidays').style.display = 'block';
    let table = document.getElementById("showTable");
    console.log(arr);
    console.log(table);
    for (let ele = 0; ele < arr.length; ele++) {
        let row = document.createElement('tr');
        let data1 = row.insertCell(0);
        let data2 = row.insertCell(1);
        let data3 = row.insertCell(2);;
        console.log(arr[ele]);
        let text = document.createTextNode(arr[ele].title.toString());
        data1.innerHTML = arr[ele].title;
        text = document.createTextNode(arr[ele].date);
        data2.innerHTML = arr[ele].date;
        text = document.createTextNode(arr[ele].notes);
        data3.innerHTML = arr[ele].notes;
        table.appendChild(row);
    }
}

function clearTable() {
    document.getElementById('showTable').innerHTML = `<tr id="heading">
    <th>Title</th>
    <th>Date</th>
    <th>Description</th>
</tr>`;
}