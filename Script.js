const calcButton = document.getElementById("calc-btn");

calcButton.addEventListener("click", function(){
    const itemName = document.getElementById("goal-name").value || "Item";
    const itemCost = Number(document.getElementById("goal-cost").value);
    const weeklyAmount = Number (document.getElementById("weekly-saving").value);
    const currentsavings = Number(document.getElementById("current-saving").value) || 0;

    if (itemCost <= 0 || weeklyAmount <= 0) {
    alert("Please enter valid numbers greater than 0!");
    return; 
}
  const moneyLeftToSave = itemCost - currentsavings;
    let weeksNeeded = 0;
    let percent = 0;

if(moneyLeftToSave <= 0) {
    weeksNeeded = 0;
    percent = 100;
} else{
    weeksNeeded = Math.ceil(moneyLeftToSave/weeklyAmount);
    percent = Math.round((currentsavings / itemCost) *100); 
}
const dailyTarget = (weeklyAmount/7).toFixed(2);
document.getElementById("dashboard").style.display = "block";
document.getElementById("statsw").textContent = `${weeksNeeded} Weeks`;
document.getElementById("statsd").textContent = `$${dailyTarget}/day`;
if(percent >= 100) {
    document.getElementById("statss").textContent = `You can buy ${itemName} now`;
} else if (percent>=75) {
    document.getElementById("statss").textContent = `You will be able to buy ${itemName} very soon`;
} else if (percent >=50 ) {
    document.getElementById("statss").textContent = "You have completed halfway";    
} else if (percent>=25) {
    document.getElementById("statss").textContent = "you are making progress";
} else {
    document.getElementById("statss").textContent = "You have just started";
}
const probar = document.getElementById("probar");
probar.style.width = percent + "%";
probar.textContent = percent + "% saved";
});
