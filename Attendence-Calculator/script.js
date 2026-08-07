const totalInput = document.getElementById("totalClasses");
const attendedInput = document.getElementById("attendedClasses");
const targetInput = document.getElementById("targetAttendance");

const attendancePercent = document.getElementById("attendancePercent");
const presentResult = document.getElementById("presentResult");
const absentResult = document.getElementById("absentResult");
const bunkResult = document.getElementById("bunkResult");
const needAttendResult = document.getElementById("needAttendResult");
const statusResult = document.getElementById("statusResult");

const progressBar = document.getElementById("progressBar");

document
    .getElementById("calculateBtn")
    .addEventListener("click", calculateAttendance);

document
    .getElementById("resetBtn")
    .addEventListener("click", resetCalculator);

function calculateAttendance() {

    const total = Number(totalInput.value);
    const attended = Number(attendedInput.value);
    const target = Number(targetInput.value);

    if (
        total <= 0 ||
        attended < 0 ||
        attended > total ||
        target <= 0 ||
        target > 100
    ) {
        alert("Please enter valid values.");
        return;
    }

    const absent = total - attended;

    const percentage = (attended / total) * 100;

    attendancePercent.textContent = percentage.toFixed(2) + "%";

    presentResult.textContent = attended;

    absentResult.textContent = absent;

    progressBar.style.width = percentage + "%";

    // ----------------------------
    // Attendance Status
    // ----------------------------

    statusResult.className = "";

    if (percentage >= 85) {
        statusResult.textContent = "Excellent";
        statusResult.classList.add("safe");
    }
    else if (percentage >= target) {
        statusResult.textContent = "Safe";
        statusResult.classList.add("safe");
    }
    else if (percentage >= 60) {
        statusResult.textContent = "Warning";
        statusResult.classList.add("warning");
    }
    else {
        statusResult.textContent = "Critical";
        statusResult.classList.add("danger");
    }

    // ----------------------------
    // Maximum Bunk Classes
    // ----------------------------

    let bunk = 0;

    while (
        attended / (total + bunk + 1) >= target / 100
    ) {
        bunk++;
    }

    bunkResult.textContent = bunk + " Classes";

    // ----------------------------
    // Classes Needed
    // ----------------------------

    let need = 0;

    while (
        (attended + need) / (total + need) < target / 100
    ) {
        need++;
    }

    needAttendResult.textContent = need + " Classes";
}

function resetCalculator() {

    totalInput.value = "";
    attendedInput.value = "";
    targetInput.value = 75;

    attendancePercent.textContent = "0%";
    presentResult.textContent = "0";
    absentResult.textContent = "0";
    bunkResult.textContent = "0";
    needAttendResult.textContent = "0";

    statusResult.textContent = "-";
    statusResult.className = "";

    progressBar.style.width = "0%";
}