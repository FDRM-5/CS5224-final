import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Input,
  Label,
  Image,
  Header,
  Modal,
  Icon,
  List,
  Dropdown,
} from "semantic-ui-react";

const RecipeLayout = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState({});

  const [diet, setDiet] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [minCalories, setMinCalories] = useState(null);
  const [maxCalories, setMaxCalories] = useState(null);

  const getRecipe = () => {
    if (!ingredients?.length) return;
    fetch(
      // prettier-ignore
      `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredients.join(",")}${diet ? `&diet=${diet}` : ""}${cuisine ? `&cuisine=${cuisine}` : ""}${minCalories ? `&minCalories=${minCalories}` : ""}${maxCalories ? `&maxCalories=${maxCalories}` : ""}&addRecipeNutrition=true&number=6&apiKey=42e08cd7ff414511b22437f94fcd728c`
    )
      .then((res) => res.json())
      .then((res) => {
        const processedResult = res?.results?.map((result) => {
          const caloriesObj = result?.nutrition?.nutrients?.filter(
            (nutrient) => nutrient.name === "Calories"
          );
          return Object.assign({}, result, { calories: caloriesObj?.[0] });
        });
        setRecipes(processedResult);
      })
      .catch((err) => console.log("An error occured:", err));
  };

  const removeIngredient = (ingredient) => {
    setIngredients((curr) => curr.filter((item) => item !== ingredient));
    getRecipe();
  };

  const fetchRecipeDetails = (recipeId) => {
    fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=42e08cd7ff414511b22437f94fcd728c`
    )
      .then((res) => res.json())
      .then((res) => {
        setSelectedRecipe(res);
      })
      .catch((err) => console.log("An error occured:", err));
  };

  return (
    <div css={{ padding: "70px 50px 50px 50px" }}>
      <Modal open={openModal} onClose={() => setOpenModal(false)} closeIcon>
        {selectedRecipe?.id ? (
          <div css={{ padding: 50 }}>
            <Header size="large">{selectedRecipe?.title}</Header>
            <div css={{ color: "#6c6f76" }}>{selectedRecipe?.id}</div>
            <Image size="large" src={selectedRecipe?.image} />
            <Label color="teal">
              <Icon name="thumbs up" size="large" />
              {selectedRecipe?.aggregateLikes}
            </Label>
            <div css={{ padding: 10 }}>
              <Header size="small">Description</Header>
              <div
                dangerouslySetInnerHTML={{ __html: selectedRecipe?.summary }}
              />
            </div>
            <div css={{ padding: "25px 0" }}>
              <Header size="small">Details</Header>
              <List bulleted>
                <List.Item>{`Ready in: ${selectedRecipe?.readyInMinutes}`}</List.Item>
                <List.Item>{`Serves: ${selectedRecipe?.servings}`}</List.Item>
                <List.Item>{`Health score: ${selectedRecipe?.healthScore}`}</List.Item>
              </List>
            </div>
            <div css={{ padding: "25px 0" }}>
              <Header size="small">Ingredients</Header>
              <List bulleted>
                {selectedRecipe?.extendedIngredients?.map((item) => (
                  <List.Item>{`${item.original}`}</List.Item>
                ))}
              </List>
            </div>
          </div>
        ) : (
          <div
            css={{
              padding: 50,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Icon loading name="spinner" size="huge" />
          </div>
        )}
      </Modal>
      <div css={{ width: 500 }}>
        <Input
          action={{
            color: "teal",
            labelPosition: "right",
            icon: "cart",
            content: "Add",
            onClick: () => {
              if (ingredientInput) {
                setIngredients((curr) => [...curr, ingredientInput]);
                setIngredientInput("");
              }
            },
          }}
          type="text"
          placeholder="Ingredients"
          value={ingredientInput}
          onChange={(e, data) => {
            setIngredientInput(data.value);
          }}
          label="Ingredients"
        />
      </div>
      <div css={{ marginTop: 50, display: "flex" }}>
        <div css={{ width: "20%", paddingRight: 15 }}>
          <Dropdown
            placeholder="Select diet..."
            fluid
            search
            selection
            options={[
              { key: "Gluten Free", value: "Gluten Free", text: "Gluten Free" },
              { key: "Ketogenic", value: "Ketogenic", text: "Ketogenic" },
              { key: "Vegetarian", value: "Vegetarian", text: "Vegetarian" },
              { key: "Vegan", value: "Vegan", text: "Vegan" },
            ]}
            onChange={(e, { value }) => {
              setDiet(value);
            }}
            value={diet}
          />
        </div>
        <div css={{ width: "20%", paddingRight: 15 }}>
          <Dropdown
            placeholder="Select cuisine..."
            fluid
            search
            selection
            options={[
              { key: "American", value: "American", text: "American" },
              { key: "British", value: "British", text: "British" },
              { key: "Chinese", value: "Chinese", text: "Chinese" },
              { key: "French", value: "French", text: "French" },
              { key: "Indian", value: "Indian", text: "Indian" },
              { key: "Italian", value: "Italian", text: "Italian" },
              { key: "Mexican", value: "Mexican", text: "Mexican" },
              {
                key: "Middle Eastern",
                value: "Middle Eastern",
                text: "Middle Eastern",
              },
              { key: "Nordic", value: "Nordic", text: "Nordic" },
              { key: "Spanish", value: "Spanish", text: "Spanish" },
              { key: "Thai", value: "Thai", text: "Thai" },
              { key: "Vietnamese", value: "Vietnamese", text: "Vietnamese" },
            ]}
            onChange={(e, { value }) => {
              setCuisine(value);
            }}
            value={cuisine}
          />
        </div>
        <div css={{ paddingRight: 15 }}>
          <Input
            label={{ basic: true, content: "Kcal" }}
            labelPosition="right"
            placeholder="Min calories..."
            value={minCalories}
            onChange={(e, { value }) => {
              const int = /^[0-9\b]+$/;
              if (int.test(value) || minCalories.length === 1) {
                setMinCalories(value);
              }
            }}
          />
        </div>
        <div css={{ paddingRight: 15 }}>
          <Input
            label={{ basic: true, content: "Kcal" }}
            labelPosition="right"
            placeholder="Max calories..."
            value={maxCalories}
            onChange={(e, { value }) => {
              const int = /^[0-9\b]+$/;
              if (int.test(value) || minCalories.length === 1) {
                setMaxCalories(value);
              }
            }}
          />
        </div>
      </div>
      <div css={{ marginTop: 50 }}>
        {ingredients?.length > 0 ? (
          <Card>
            <div css={{ padding: 20 }}>
              {ingredients.map((i) => (
                <Label color="green" size="large">
                  {i} <Icon name="close" onClick={() => removeIngredient(i)} />
                </Label>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <div css={{ padding: 20 }}>
              <Header size="medium">
                Your chosen ingredients will be listed here...
              </Header>
            </div>
          </Card>
        )}
      </div>
      <div css={{ marginTop: 50 }}>
        <Button
          content="Find me recipes"
          color="teal"
          onClick={getRecipe}
          disabled={ingredients?.length === 0}
        />
      </div>
      {recipes?.length > 0 && (
        <div css={{ marginTop: 50 }}>
          <Header
            content={ingredients?.length ? "Your recipes" : "Featured recipes"}
            size="small"
          />
          <div css={{ display: "flex", flexWrap: "wrap" }}>
            {recipes?.slice(0, 6)?.map((recipe) => (
              <div
                onClick={() => {
                  fetchRecipeDetails(recipe.id);
                  setOpenModal(true);
                }}
              >
                <Card style={{ margin: 10, padding: 10 }}>
                  <Card.Header>{recipe.title}</Card.Header>
                  <Card.Content>
                    <Image src={recipe.image} size="small" />
                    <Label color="red" tag>
                      <Icon name="thumbs up" size="small" />
                      {recipe?.likes}
                    </Label>
                  </Card.Content>
                  <List>
                    <List.Item>
                      <Icon name="hand point right" />
                      {`Protein: ${recipe?.nutrition?.caloricBreakdown?.percentProtein}%`}
                    </List.Item>
                    <List.Item>
                      <Icon name="hand point right" />
                      {`Fat: ${recipe?.nutrition?.caloricBreakdown?.percentFat}%`}
                    </List.Item>
                    <List.Item>
                      <Icon name="hand point right" />
                      {`Carb: ${recipe?.nutrition?.caloricBreakdown?.percentCarbs}%`}
                    </List.Item>
                    <List.Item>
                      <Icon name="gripfire" color="orange" />
                      {`Calories: ${recipe?.calories?.amount} ${recipe?.calories?.unit}`}
                    </List.Item>
                    {recipe?.vegetarian && (
                      <List.Item>
                        <Icon name="leaf" color="green" />
                        Vegetarian
                      </List.Item>
                    )}
                  </List>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeLayout;
