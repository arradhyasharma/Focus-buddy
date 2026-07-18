  function updateTime(){
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
    }
setInterval(updateTime,1000);

window.addLumpsumSavingsValue = function(targetID) {
    const item = trackingItemsList.find(el => String(el.id) === String(targetID));
    const inputField = document.getElementById(`lumsum-val-${targetID}`);
    
    if (!item || !inputField) return;

    let injectionValue = Number(inputField.value);
    if (isNaN(injectionValue) || injectionValue <= 0) {
        alert("Please enter a valid amount greater than 0!");
        return;
    }

    item.saved += injectionValue;
    if (item.saved > item.cost) item.saved = item.cost;

    inputField.value = ""; 
    saveAndRefresh();
};

window.subtractLumpsumSavingsValue = function(targetID) {
    const item = trackingItemsList.find(el => String(el.id) === String(targetID));
    const inputField = document.getElementById(`lumsum-val-${targetID}`);
    
    if (!item || !inputField) return;

    let subtractionValue = Number(inputField.value);
    if (isNaN(subtractionValue) || subtractionValue <= 0) {
        alert("Please enter a valid amount to subtract greater than 0!");
        return;
    }

    item.saved -= subtractionValue;
    if (item.saved < 0) {
        item.saved = 0;
    }

    inputField.value = ""; 
    saveAndRefresh();
};

window.addLumpsumSavingProgress = window.addLumpsumSavingsValue; 

window.applySnackOptimizationAction = function(targetID, additionWeeklySavingsBoost) {
    const item = trackingItemsList.find(el => String(el.id) === String(targetID));
    if (!item) return;

    item.weekly += additionWeeklySavingsBoost; 
    item.snacksOptimized = true; 

    alert(`Awesome optimization choice! Your weekly savings speed boosted to ${currencySymbols[item.currency]}${item.weekly.toFixed(1)}!`);
    saveAndRefresh();
};

window.logWeeklySavingsProgress = function(targetID) {
    const item = trackingItemsList.find(el => String(el.id) === String(targetID));
    if (!item) return;

    if (item.saved >= item.cost) {
        alert("Goal already completed!");
        return;
    }

    item.saved += item.weekly; 
    if (item.saved > item.cost) item.saved = item.cost;

    saveAndRefresh();
};

window.deleteWishlistItem = function(targetID) {
    trackingItemsList = trackingItemsList.filter(element => String(element.id) !== String(targetID));
    saveAndRefresh();
};


const currencySymbols = { USD: '$', INR: '₹', GBP: '£', EUR: '€' };
const calcButton = document.getElementById("calc-btn");
let trackingItemsList = [];

window.addEventListener('load', function() {
    const cachedData = localStorage.getItem('teen_tracker_ultimate_suite');
    if (cachedData) {
        trackingItemsList = JSON.parse(cachedData);
        renderAllWishlistCards();
    }
});

calcButton.addEventListener("click", function(){
    const itemName = document.getElementById("goal-name").value || "Cool Tech Item";
    let itemCost = Number(document.getElementById("goal-cost").value);
    let weeklyAmount = Number(document.getElementById("weekly-saving").value);
    let currentsavings = Number(document.getElementById("current-saving").value) || 0;
    let snacksExpense = Number(document.getElementById("snacks-cost").value) || 0;
    const selectedCurrency = document.getElementById("currency-select").value;

    if (itemCost <= 0 || weeklyAmount <= 0 || snacksExpense < 0) {
        alert("Please enter valid parameters greater than 0!");
        return; 
    }

    const newTargetGoal = {
        id: Date.now(),
        name: itemName,
        cost: itemCost,
        weekly: weeklyAmount,
        saved: currentsavings,
        snacks: snacksExpense,
        snacksOptimized: false, 
        currency: selectedCurrency
    };

    trackingItemsList.push(newTargetGoal);
    saveAndRefresh();

    document.getElementById("goal-name").value = "";
    document.getElementById("goal-cost").value = "";
    document.getElementById("current-saving").value = "0";
    document.getElementById("weekly-saving").value = "";
    document.getElementById("snacks-cost").value = "0";
});

function saveAndRefresh() {
    localStorage.setItem('teen_tracker_ultimate_suite', JSON.stringify(trackingItemsList));
    renderAllWishlistCards();
}

function renderAllWishlistCards() {
    const gridDisplayBox = document.getElementById("wishlist-grid");
    gridDisplayBox.innerHTML = "";

    if(trackingItemsList.length === 0) {
        gridDisplayBox.innerHTML = `<p style="grid-column: 1/-1; color: #eee; font-size:14px;">No active items being tracked. Add your first goal above!</p>`;
        return;
    }

    trackingItemsList.forEach(item => {
        const symbol = currencySymbols[item.currency];
        const remainingCost = item.cost - item.saved;
        
        let weeksNeeded = 0;
        let completionPercent = 0;

        if (remainingCost <= 0) {
            weeksNeeded = 0;
            completionPercent = 100;
        } else {
            weeksNeeded = Math.ceil(remainingCost / item.weekly);
            completionPercent = Math.round((item.saved / item.cost) * 100);
            if(completionPercent > 100) completionPercent = 100;
        }

        const dailyTarget = (item.weekly / 7).toFixed(1);

        let progressSentence = "";
        if (completionPercent === 0) {
            progressSentence = "Please start soon!";
        } else if (completionPercent > 0 && completionPercent < 25) {
            progressSentence = "You have just started to progress.";
        } else if (completionPercent >= 25 && completionPercent < 50) {
            progressSentence = "Sparks flying! You are building a serious habit now.";
        } else if (completionPercent >= 50 && completionPercent < 75) {
            progressSentence = "Halfway up the mountain! The target looks much closer now.";
        } else if (completionPercent >= 75 && completionPercent < 100) {
            progressSentence = "In the home stretch! The countdown to your item has begun.";
        } else if (completionPercent === 100) {
            progressSentence = "Ultimate victory reached! Target fully funded.";
        }

        let showAdvice = false;
        let adviceText = "";

        if (!item.snacksOptimized && item.snacks > 0 && completionPercent < 100) {
            const structuralBoost = item.weekly * 1.25; 
            const fasterWeeks = Math.ceil(remainingCost / structuralBoost);
            const weeksSaved = weeksNeeded - fasterWeeks;
            const extraNeededWeekly = Math.round(item.weekly * 0.25); 

            if (item.snacks > extraNeededWeekly && weeksSaved > 0 && extraNeededWeekly > 0) { 
                showAdvice = true;
                adviceText = `
                    <span>Snack Advice: Cut back your ${symbol}${item.snacks} snack expense by ${symbol}${extraNeededWeekly} to save ${weeksSaved} week(s) faster!</span>
                    <button class="cut-snacks-btn" onclick="applySnackOptimizationAction(${item.id}, ${extraNeededWeekly})">Cut Snacks & Add to Savings</button>
                `;
            }
        }

        const dynamicAdviceHTML = showAdvice ? `<div class="advice-box">${adviceText}</div>` : '';
        const cardClassList = completionPercent === 100 ? "wishlist-card completed-goal" : "wishlist-card";

        const cardStructure = document.createElement("div");
        cardStructure.className = cardClassList;
        cardStructure.innerHTML = `
            <div class="card-header">
                <h3>${item.name}</h3>
                <button class="delete-btn" onclick="deleteWishlistItem(${item.id})">✕</button>
            </div>
            <p class="card-cost">Total Cost: <b>${symbol}${item.cost}</b> | Saved: <b>${symbol}${item.saved}</b></p>
            
            <div class="progress" style="height:22px; background:#0f172a; margin: 10px 0;">
                <div id="probar" style="width: ${completionPercent}%; background-color: #38bdf8;">${completionPercent}%</div>
            </div>

            <div class="card-meta">
                <div><b>${weeksNeeded} Wks</b> left</div>
                <div><b>${symbol}${dailyTarget}</b>/day</div>
            </div>

            <div class="status-box">${progressSentence}</div>

            ${dynamicAdviceHTML}

            <canvas id="chart-${item.id}" width="280" height="110" class="card-canvas"></canvas>
            
            <div class="lumsum-container">
                <input type="number" id="lumsum-val-${item.id}" class="lumsum-input" placeholder="Amount to adjust...">
                <div class="lumsum-btn-group">
                    <button class="lumsum-btn" onclick="addLumpsumSavingsValue(${item.id})">+ Add</button>
                    <button class="lumsum-btns" onclick="subtractLumpsumSavingsValue(${item.id})">- Remove</button>
                </div>
            </div>

            <div class="btn-group">
                <button class="log-btn" onclick="logWeeklySavingsProgress(${item.id})"> chart + Log Week</button>
            </div>
        `;
        
        gridDisplayBox.appendChild(cardStructure);
        
        setTimeout(() => {
            drawIndividualCardChart(`chart-${item.id}`, item.saved, item.cost, item.weekly, weeksNeeded, symbol, completionPercent);
        }, 10);
    });
}

function drawIndividualCardChart(canvasID, current, cost, weekly, weeksNeeded, symbol, completionPercent) {
    const canvas = document.getElementById(canvasID);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;
    
    ctx.strokeStyle = "#334155"; 
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height/2);
    ctx.lineTo(width - padding, height/2);
    ctx.stroke();

    let totalPoints = Math.max(weeksNeeded, 1);
    let points = [];
    
    for (let w = 0; w <= totalPoints; w++) {
        let currentWorth = current + (w * weekly);
        if (currentWorth > cost) currentWorth = cost;
        
        let x = padding + ((width - 2 * padding) / totalPoints) * w;
        let y = height - padding - ((currentWorth / cost) * (height - 2 * padding));
        points.push({x, y});
    }

    const fillStyleColor = completionPercent === 100 ? "rgba(16, 185, 129, 0.1)" : "rgba(56, 189, 248, 0.1)";
    const strokeStyleColor = completionPercent === 100 ? "#10b981" : "#38bdf8";

    ctx.fillStyle = fillStyleColor; 
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = strokeStyleColor; 
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    ctx.fillStyle = "#94a3b8"; 
    ctx.font = "9px Montserrat, sans-serif";
    ctx.fillText("Now", padding, height - 6);
    ctx.fillText(`Target`, width - padding - 32, padding - 4);
}
