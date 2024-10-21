from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Database connection details
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'recipes'
}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this for production with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalorieGoals(BaseModel):
    breakfast: float
    lunch: float
    dinner: float

@app.post("/recipes/")
async def get_recipes(calorie_goals: CalorieGoals):
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # SQL query to filter recipes based on calorie goals with a margin of 50 calories
        query = """
            SELECT * FROM diet 
            WHERE Calories <= %s AND Calories >= %s
            limit 10
        """
        
        # Set to keep track of unique recipes
        unique_recipes = set()

        # Fetch recipes for breakfast, lunch, and dinner
        for meal in [calorie_goals.breakfast, calorie_goals.lunch, calorie_goals.dinner]:
            lower_bound = meal - 50  # Calculate the lower bound (meal - 50)
            cursor.execute(query, (meal, lower_bound))
            results = cursor.fetchall()

            # Add recipes to the set to ensure uniqueness
            for recipe in results:
                unique_recipes.add((recipe['RecipeId'], recipe['Name'], recipe['Calories'], recipe['RecipeInstructions']))

        # Convert back to list of dictionaries
        recipes = [
            {"RecipeId": recipe[0], "Name": recipe[1], "Calories": recipe[2], "RecipeInstructions": recipe[3]}
            for recipe in unique_recipes
        ]

        return {"recipes": recipes}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
