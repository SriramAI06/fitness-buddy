import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function BMICalculator() {
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [gender, setGender] = useState('female');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('weightLoss');
  const [bmi, setBmi] = useState(null);
  const [calories, setCalories] = useState({
    maintain: null,
    weightLoss: null,
    weightGain: null,
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(1));
  };

  const calculateCalories = () => {
    let bmr;
    if (gender === 'male') {
      bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
      bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    let multiplier;
    switch (activityLevel) {
      case 'little':
        multiplier = 1.2;
        break;
      case 'moderate':
        multiplier = 1.55;
        break;
      case 'active':
        multiplier = 1.9;
        break;
      default:
        multiplier = 1.2;
    }

    const dailyCalories = bmr * multiplier;
    setCalories({
      maintain: dailyCalories.toFixed(0),
      weightLoss: (dailyCalories - 500).toFixed(0),
      weightGain: (dailyCalories + 500).toFixed(0),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateBMI();
    calculateCalories();
  };

  const recommendRecipes = async () => {
    const calorieGoals = {
      breakfast: goal === 'weightLoss' ? calories.weightLoss / 3 : calories.weightGain / 3,
      lunch: goal === 'weightLoss' ? calories.weightLoss / 3 : calories.weightGain / 3,
      dinner: goal === 'weightLoss' ? calories.weightLoss / 3 : calories.weightGain / 3,
    };

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/recipes/', calorieGoals);
      console.log('Fetched Recipes:', response.data);

      const uniqueRecipes = Array.from(new Set(response.data.recipes.map(recipe => recipe.Name)))
        .map(name => response.data.recipes.find(recipe => recipe.Name === name));

      setRecipes(uniqueRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Error fetching recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipe = (recipeId) => {
    setExpandedRecipeId(expandedRecipeId === recipeId ? null : recipeId);
  };

  return (
    <Container  style={{ backgroundColor: '#fff8dc', borderRadius: '20px', padding: '20px', marginTop: '30px'}}>
      <Typography variant="h4" align="center" style={{ color: '#f44336' }}>BMI & Calorie Calculator</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{ style: { color: '#fff' }, style: { backgroundColor: '#fff8dc' } }}
        />
        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{ style: { color: '#fff' }, style: { backgroundColor: '#fff8dc' } }}
        />
        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{ style: { color: '#fff' }, style: { backgroundColor: '#fff8dc' } }}
        />
        <Select
          fullWidth
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          margin="normal"
          variant="outlined"
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
        >
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="male">Male</MenuItem>
        </Select>
        <Select
          fullWidth
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
          margin="normal"
          variant="outlined"
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
        >
          <MenuItem value="little">Little/no exercise</MenuItem>
          <MenuItem value="moderate">Moderate (3-5 days/wk)</MenuItem>
          <MenuItem value="active">Very active (physical job)</MenuItem>
        </Select>
        <Select
          fullWidth
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          margin="normal"
          variant="outlined"
          style={{ backgroundColor: '#ffffff', color: '#000000', }}
        >
          <MenuItem value="weightLoss">Weight Loss</MenuItem>
          <MenuItem value="weightGain">Weight Gain</MenuItem>
        </Select>
        <Button
          type="submit"
          variant="contained"
          color="error"
          fullWidth
          style={{ marginTop: '20px', width:'200px'}}
        >
          Calculate
        </Button>
      </form>

      {bmi && (
        <Card style={{ marginTop: '20px', backgroundColor: '#ffffff' }}>
          <CardContent>
            <Typography variant="h5">BMI: {bmi} kg/m²</Typography>
            <Typography variant="body1" style={{ color: bmi < 18.5 ? 'blue' : bmi < 25 ? 'green' : bmi < 30 ? 'orange' : 'red' }}>
              {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {calories.maintain && (
        <Card style={{ marginTop: '20px', backgroundColor: '#ffffff' }}>
          <CardContent>
            <Typography variant="h6" style={{ color: '#f44336' }}>Calories Needed:</Typography>
            <Typography><strong>Maintain Weight:</strong> {calories.maintain} kcal/day</Typography>
            <Typography><strong>Weight Loss:</strong> {calories.weightLoss} kcal/day (-500 kcal)</Typography>
            <Typography><strong>Weight Gain:</strong> {calories.weightGain} kcal/day (+500 kcal)</Typography>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <CircularProgress style={{ marginTop: '20px' }} />
      ) : (
        <Button
          onClick={recommendRecipes}
          variant="contained"
          color="error"
          fullWidth
          style={{ marginTop: '20px', width:'200px' }}
        >
          Get Recipes
        </Button>
      )}

      {recipes.length > 0 && (
        <div style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'scroll' }}>
          <Typography variant="h6" style={{ color: '#f44336' }}>Recommended Recipes:</Typography>
          <Grid container spacing={2}>
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.RecipeId}>
                <Accordion expanded={expandedRecipeId === recipe.RecipeId} onChange={() => toggleRecipe(recipe.RecipeId)}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`recipe-${recipe.RecipeId}-content`} id={`recipe-${recipe.RecipeId}-header`}>
                    <Typography variant="h6">{recipe.Name}</Typography>
                    <Chip label={`${recipe.Calories} kcal`} color="error" style={{ marginLeft: '10px' }} />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{recipe.RecipeInstructions}</Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Container>
  );
}

export default BMICalculator;
