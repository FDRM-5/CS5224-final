import { useCallback, useState, useEffect } from "react";

import Note from "./Note";
import { useNote } from "./api/Note.api";

const NoteContainer = () => {
	const [textInState, setTextInState] = useState("");
	const [isSaved, setIsSaved] = useState(true);
	const { getNote = {}, editNote = {} } = useNote();
	const { data, isFetching, remove, isError } = getNote;
	const { mutate, isError: isEditError, isLoading } = editNote;

	useEffect(() => {
		setTextInState(data?.text || "");
	}, [data, setTextInState]);

	useEffect(() => {
		return () => {
			remove();
		};
	}, []);

	useEffect(() => {
		if (data?.text !== textInState && isSaved) setIsSaved(false);
		if (data?.text === textInState && !isSaved) setIsSaved(true);
	}, [setIsSaved, data, textInState]);

	const onEditNote = useCallback(() => {
		mutate({ text: textInState });
	}, [mutate, textInState]);

	return (
		<Note
			textInState={textInState}
			loading={isFetching && !data}
			errorOccured={isError || isEditError}
			setTextInState={setTextInState}
			onEditNote={onEditNote}
			saving={isLoading}
			isSaved={isSaved}
			isEditError={isEditError}
		/>
	);
};

export default NoteContainer;
