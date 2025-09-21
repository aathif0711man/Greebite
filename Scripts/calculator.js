document.getElementById('calc-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const activity = parseFloat(document.getElementById('activity').value);

  // Calculate BMR
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Calculate TDEE
  const tdee = bmr * activity;

  // Macronutrients
  const carbs = (tdee * 0.50) / 4;
  const protein = (tdee * 0.20) / 4;
  const fat = (tdee * 0.30) / 9;

  // Show results
  document.getElementById('bmr').textContent = bmr.toFixed(0);
  document.getElementById('tdee').textContent = tdee.toFixed(0);
  document.getElementById('carbs').textContent = carbs.toFixed(0);
  document.getElementById('protein').textContent = protein.toFixed(0);
  document.getElementById('fat').textContent = fat.toFixed(0);

  document.getElementById('results').style.display = "block";

  // Animate progress bars
  document.getElementById('carbs-bar').style.width = "50%";
  document.getElementById('protein-bar').style.width = "20%";
  document.getElementById('fat-bar').style.width = "30%";
});
