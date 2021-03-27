import { useState } from "react";
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
} from "semantic-ui-react";

const RecipeLayout = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState({});

  const getRecipe = () => {
    fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=42e08cd7ff414511b22437f94fcd728c`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("es", res);
        setRecipes(res);
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
        console.log("es", res);
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
      <div css={{ marginTop: 50 }}>
        {ingredients?.length > 0 ? (
          ingredients.map((i) => (
            <Label color="green" size="large">
              {i} <Icon name="close" onClick={() => removeIngredient(i)} />
            </Label>
          ))
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
          <Header content="Your recipes" size="small" />
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
