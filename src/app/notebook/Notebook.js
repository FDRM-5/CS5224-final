import { useState, useCallback } from "react";

import { Header, Icon, Segment } from "semantic-ui-react";

import Editor from "./Editor";

const Notebook = () => {
	const [entered, setEntered] = useState(false);
	const [file, setFile] = useState({});

	const handleDragEnter = useCallback((e) => {
		setEntered(true);
	});

	const handleMouseLeave = useCallback((e) => {
		if (entered) setEntered(false);
	});

	return (
		<div
			onDragEnter={(e) => handleDragEnter(e)}
			onDragOver={(e) => e.preventDefault()}
			onMouseLeave={handleMouseLeave}
			css={{
				width: "100%",
				background: "#fff",
				marginTop: 200,
			}}>
			{entered ? (
				<div
					onDrop={(e) => {
						e.preventDefault();
						if (e?.dataTransfer?.files?.[0]) {
							setFile(
								Object.assign(e.dataTransfer.files[0], {
									preview: URL.createObjectURL(e.dataTransfer.files[0]),
								})
							);
							// console.log("file", e.dataTransfer.files[0]);
						}
					}}>
					<Segment placeholder>
						<Header icon>
							<Icon name="pdf file outline" />
							Add informatic here
						</Header>
					</Segment>
				</div>
			) : (
				<Editor />
			)}
		</div>
	);
};

export default Notebook;
