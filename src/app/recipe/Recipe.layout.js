import { useState } from "react";
import { Button, Card, Input, Label, Image, Header } from "semantic-ui-react";

const RecipeLayout = () => {
	const [ingredients, setIngredients] = useState([]);
	const [recipes, setRecipes] = useState([]);
	const [ingredientInput, setIngredientInput] = useState("");

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

	console.log("recipes", recipes);

	return (
		<div css={{ paddingTop: 100 }}>
			<div css={{ width: 400 }}>
				<Input
					action={{
						color: "teal",
						labelPosition: "right",
						icon: "cart",
						content: "Add",
						onClick: () => {
							setIngredients((curr) => [...curr, ingredientInput]);
							setIngredientInput("");
						},
					}}
					type="text"
					placeholder="Ingredients"
					value={ingredientInput}
					onChange={(e, data) => {
						console.log(data);
						setIngredientInput(data.value);
					}}
					label="Ingredients"
				/>
			</div>
			<div
				css={{
					marginTop: 100,
					padding: 20,
					borderRadius: 3,
					border: "1px solid grey",
				}}>
				{ingredients.map((i) => (
					<Label color="green">{i}</Label>
				))}
			</div>
			<div css={{ marginTop: 100 }}>
				<Button
					content="Find me ingredients"
					color="teal"
					onClick={getRecipe}
				/>
			</div>
			{recipes?.length > 0 && (
				<div css={{ marginTop: 100 }}>
					<Header content="Your recipes" size="small" />
					<div css={{ display: "flex", flexWrap: "wrap" }}>
						{recipes?.slice(0, 6)?.map((recipe) => (
							<Card style={{ margin: 10 }}>
								<Card.Header>{recipe.title}</Card.Header>
								<Card.Content>
									<Image src={recipe.image} size="small" />
								</Card.Content>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default RecipeLayout;
