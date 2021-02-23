import { useQuery, useMutation, useQueryClient } from "react-query";

const useQueryOptions = {
	refetchOnWindowFocus: false,
	staleTime: 300000,
};

export const useJoke = () => {
	return useQuery(
		"addJoke",
		() =>
			fetch(
				"https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous,Dark,Pun"
			).then((res) => res.json()),
		useQueryOptions
	);
};

export const useNote = () => {
	const queryClient = useQueryClient();
	const getNote = useQuery(
		"notes",
		() => fetch("http://localhost:3005/notes").then((res) => res.json()),
		useQueryOptions
	);

	const postNote = useMutation((note) =>
		fetch("http://localhost:3005/notes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(note),
		}).then((res) => res.json())
	);

	const editNote = useMutation(
		(note) =>
			fetch(`http://localhost:3005/notes/update/${getNote?.data?._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(note),
			}).then((res) => res.json()),
		{
			onSuccess: () => queryClient.invalidateQueries("notes", { exact: true }),
		}
	);

	return { getNote, postNote, editNote };
};
