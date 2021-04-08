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
import { Auth } from "aws-amplify";
import moment from "moment";

const RecipeLayout = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState({});
  const [savedRecipe, setSavedRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [favouriteAdded, setFavouriteAdded] = useState(false);

  const [diet, setDiet] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");

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

  const handleClearAll = () => {
    setDiet("");
    setCuisine("");
    setMaxCalories("");
    setMinCalories("");
    getRecipe();
  };

  const fetchRecipeDetails = (recipeId) => {
    fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=42e08cd7ff414511b22437f94fcd728c`
    )
      .then((res) => res.json())
      .then((res) => {
        const processedResult = res?.results?.map((result) => {
          const caloriesObj = result?.nutrition?.nutrients?.filter(
            (nutrient) => nutrient.name === "Calories"
          );
          return Object.assign({}, result, { calories: caloriesObj?.[0] });
        });
        setSelectedRecipe(processedResult);
      })
      .catch((err) => console.log("An error occured:", err));
  };

  const fetchSavedRecipes = () => {
    if (!user?.username) return;
    fetch(
      `https://tvqetxrq89.execute-api.us-east-1.amazonaws.com/default/LambdaFunction?user_name=${user.username}`
    )
      .then((res) => res.json())
      .then((res) => {
        const processedRecipes = res?.Items?.map((result) => result.recipe);
        setSavedRecipe(processedRecipes);
      })
      .catch((err) => console.log("An error occured:", err));
  };

  const saveRecipe = (selectedRecipe) => {
    if (!user?.username) return;
    fetch(
      "https://tvqetxrq89.execute-api.us-east-1.amazonaws.com/default/LambdaFunction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          user_name: user.username,
          recipe: { ...selectedRecipe, savedOn: new Date() },
        }),
      }
    )
      .then((res) => {
        if (!res || !Object.keys(res)?.length) return;
        return res.json();
      })
      .then(() => {
        setFavouriteAdded(true);
        fetchSavedRecipes();
      })
      .catch((err) => console.log("An error occured:", err));
  };

  const handleSendEmail = () => {
    if (!selectedRecipe?.title) return;
    fetch("https://0ayu5o2qzc.execute-api.us-east-1.amazonaws.com/Prod/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        toEmails: [userEmail],
        subject: `Hey, check out this recipe! ${selectedRecipe.title}`,
        message: `${selectedRecipe.title} (${selectedRecipe.id})\n\n${
          selectedRecipe.summary?.replace(/<[^>]+>/g, "") || ""
        }\n\n Find the recipe here: ${selectedRecipe.sourceUrl}`,
      }),
    })
      .then((res) => {
        if (!res || !Object.keys(res)?.length) return;
        return res.json();
      })
      .then((res) => {
        setEmailSent(true);
      })
      .catch((err) => console.log("An error occured:", err));
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser({ bypassCache: true });
        if (user?.attributes) {
          setUser({ ...user.attributes, username: user.username });
        }
      } catch (err) {
        alert("error in loading user", err);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchSavedRecipes();
      setUserEmail(user.email);
    }
  }, [user]);

  return (
    <div css={{ padding: "70px 50px 50px 50px" }}>
      <div
        css={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div css={{ width: "70%" }}>
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onOpen={() => setFavouriteAdded(false)}
            closeIcon
          >
            {selectedRecipe?.id ? (
              <div css={{ padding: 50 }}>
                <Header size="large">{selectedRecipe?.title}</Header>
                <div css={{ color: "#6c6f76" }}>{selectedRecipe?.id}</div>
                <Image size="large" src={selectedRecipe?.image} />
                <div
                  css={{
                    padding: "20px 0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Label color="teal">
                    <Icon name="thumbs up" size="large" />
                    {selectedRecipe?.aggregateLikes}
                  </Label>
                  <Modal
                    onOpen={() => setEmailSent(false)}
                    size="tiny"
                    trigger={
                      <Button size="small" color="blue">
                        <Icon name="mail" />
                        Email
                      </Button>
                    }
                    closeIcon
                  >
                    <div
                      css={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 50,
                      }}
                    >
                      <Header size="large">
                        Share this recipe with your friends!
                      </Header>
                      <Header size="medium">{selectedRecipe?.title}</Header>
                      <Input
                        action={{
                          color: "teal",
                          labelPosition: "right",
                          icon: "mail",
                          content: "Email",
                        }}
                        type="text"
                        placeholder="Email address"
                        value={userEmail}
                        onChange={(e, data) => {
                          setUserEmail(data.value);
                        }}
                      />
                      <div css={{ paddingTop: 50 }}>
                        <Button
                          color="yellow"
                          content={emailSent ? "Sent!" : "Send"}
                          onClick={handleSendEmail}
                          disabled={emailSent}
                        />
                      </div>
                    </div>
                  </Modal>
                  <Button
                    size="small"
                    color="red"
                    basic={!favouriteAdded}
                    disabled={favouriteAdded}
                    onClick={() => saveRecipe(selectedRecipe)}
                  >
                    <Icon name="favorite" />
                    {favouriteAdded ? "Added!" : "Add to favourites"}
                  </Button>
                </div>
                <div css={{ padding: 10 }}>
                  <Header size="small">Description</Header>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedRecipe?.summary,
                    }}
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
          {user?.username && (
            <div css={{ marginBottom: 30 }}>
              <Header size="huge">
                <span>Hi, </span>
                <span css={{ color: "#00b5ad" }}>{user.username}</span>
                <Header.Subheader>
                  What would you like to cook today?
                </Header.Subheader>
              </Header>
            </div>
          )}
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
          <div css={{ marginTop: 50, display: "flex", alignItems: "center" }}>
            <div css={{ width: "20%", paddingRight: 10 }}>
              <Dropdown
                placeholder="Select diet..."
                fluid
                search
                selection
                options={[
                  {
                    key: "Gluten Free",
                    value: "Gluten Free",
                    text: "Gluten Free",
                  },
                  { key: "Ketogenic", value: "Ketogenic", text: "Ketogenic" },
                  {
                    key: "Vegetarian",
                    value: "Vegetarian",
                    text: "Vegetarian",
                  },
                  { key: "Vegan", value: "Vegan", text: "Vegan" },
                ]}
                onChange={(e, { value }) => {
                  setDiet(value);
                }}
                value={diet}
              />
            </div>
            <div css={{ width: "20%", paddingRight: 10 }}>
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
                  {
                    key: "Vietnamese",
                    value: "Vietnamese",
                    text: "Vietnamese",
                  },
                ]}
                onChange={(e, { value }) => {
                  setCuisine(value);
                }}
                value={cuisine}
              />
            </div>
            <div css={{ paddingRight: 10, width: "24%" }}>
              <Input
                style={{ width: 120 }}
                label={{ basic: true, content: "Kcal" }}
                labelPosition="right"
                placeholder="Min calories..."
                value={minCalories}
                onChange={(e, { value }) => {
                  const int = /^[0-9\b]+$/;
                  if (int.test(value) || value === "") {
                    setMinCalories(value);
                  }
                }}
              />
            </div>
            <div css={{ paddingRight: 10, width: "24%" }}>
              <Input
                style={{ width: 120 }}
                label={{ basic: true, content: "Kcal" }}
                labelPosition="right"
                placeholder="Max calories..."
                value={maxCalories}
                onChange={(e, { value }) => {
                  const int = /^[0-9\b]+$/;
                  if (int.test(value) || value === "") {
                    setMaxCalories(value);
                  }
                }}
              />
            </div>
            <div
              onClick={handleClearAll}
              css={{ paddingRight: 15, cursor: "pointer" }}
            >
              <Icon name="redo" content="Clear all" color="grey" />
              <span css={{ fontSize: 12, color: "#6c6f76" }}>Clear all</span>
            </div>
          </div>
          <div css={{ marginTop: 50 }}>
            {ingredients?.length > 0 ? (
              <Card>
                <div css={{ padding: 20 }}>
                  <Header size="tiny" style={{ textDecoration: "underline" }}>
                    Ingredients
                  </Header>
                  {ingredients.map((i) => (
                    <Label color="green" size="large">
                      {i}{" "}
                      <Icon name="close" onClick={() => removeIngredient(i)} />
                    </Label>
                  ))}
                </div>
              </Card>
            ) : (
              <Card>
                <div css={{ padding: 20 }}>
                  <Header size="tiny" style={{ textDecoration: "underline" }}>
                    Ingredients
                  </Header>
                  <div css={{ fontSize: 12, opacity: 0.4 }}>
                    Your chosen ingredients will be listed here...
                  </div>
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
        </div>
        <div
          css={{
            width: "30%",
            height: 500,
            maxHeight: 500,
            overflowY: "scroll",
            "&::-ms-overflow-style": { display: "none" },
            "&::scrollbar-width": { display: "none" },
            "&::-webkit-scrollbar": { display: "none" },
            background: "rgba(0,0,0,0.1)",
            borderRadius: 3,
            marginTop: 50,
            padding: 15,
          }}
        >
          <div
            css={{
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "underline",
              paddingBottom: 15,
            }}
          >
            Saved Recipes
          </div>
          {savedRecipe?.length ? (
            savedRecipe.map((meal) => (
              <div
                onClick={() => {
                  fetchRecipeDetails(meal.id);
                  setOpenModal(true);
                }}
                css={{ cursor: "pointer" }}
              >
                <Card fluid style={{ marginBottom: 10 }}>
                  <Card.Content style={{ paddingTop: 2 }}>
                    <Label
                      size="mini"
                      color={
                        meal?.healthScore < 40
                          ? "red"
                          : meal?.healthScore < 60
                          ? "yellow"
                          : "green"
                      }
                      ribbon
                    >
                      {`Health score: ${meal?.healthScore}`}
                    </Label>
                    <Card.Header style={{ paddingTop: 10 }}>
                      {meal.title}
                    </Card.Header>
                    <Image src={meal.image} size="small" />
                    <List>
                      <List.Item>
                        <div css={{ fontSize: 10, opacity: 0.4 }}>
                          {`Saved on ${moment(meal.savedOn).format(
                            "DD MMM YYYY"
                          )}`}
                        </div>
                      </List.Item>
                      <List.Item>
                        <Icon name="gripfire" color="orange" />
                        {`Calories: ${meal?.calories?.amount} ${meal?.calories?.unit}`}
                      </List.Item>
                      {meal?.vegetarian && (
                        <List.Item>
                          <Icon name="leaf" color="green" />
                          Vegetarian
                        </List.Item>
                      )}
                    </List>
                  </Card.Content>
                </Card>
              </div>
            ))
          ) : (
            <div css={{ fontSize: 12, color: "#6c6f76" }}>No saved recipes</div>
          )}
        </div>
      </div>
      {recipes?.length > 0 && (
        <div
          css={{
            width: "100%",
            marginTop: 20,
            background: "rgba(0,0,0,0.05)",
            borderRadius: 3,
            padding: 20,
          }}
        >
          <div>
            <Header
              content={
                ingredients?.length ? "Your recipes" : "Featured recipes"
              }
              size="small"
            />
            <div
              css={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
              }}
            >
              {recipes?.slice(0, 6)?.map((recipe) => (
                <div
                  onClick={() => {
                    fetchRecipeDetails(recipe.id);
                    setOpenModal(true);
                  }}
                >
                  <Card style={{ marginBottom: 20 }}>
                    <Card.Content style={{ paddingTop: 5 }}>
                      <Label
                        size="mini"
                        color={
                          recipe?.healthScore < 40
                            ? "red"
                            : recipe?.healthScore < 60
                            ? "yellow"
                            : "green"
                        }
                        ribbon
                      >
                        {`Health score: ${recipe?.healthScore}`}
                      </Label>
                      <Card.Header style={{ paddingTop: 10 }}>
                        {recipe.title}
                      </Card.Header>
                      <Image src={recipe.image} size="small" />
                      <Label color="red" tag>
                        <Icon name="thumbs up" size="small" />
                        {recipe?.likes}
                      </Label>
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
                    </Card.Content>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeLayout;
