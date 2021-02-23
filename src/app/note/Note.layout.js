import NoteContainer from "./Note.container";

const NoteLayout = () => {
	return (
		<div css={{ paddingTop: 100, display: "flex", justifyContent: "center" }}>
			<NoteContainer />
		</div>
	);
};

export default NoteLayout;
