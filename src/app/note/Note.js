import { Icon } from "semantic-ui-react";

import { Loader } from "@common";

const Note = ({
	textInState,
	loading,
	setTextInState,
	onEditNote,
	saving,
	isSaved,
	isEditError,
}) => {
	const defaultNoteWidth = 475;
	const defaultNoteHeight = 450;

	return (
		<div
			css={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
			}}>
			{loading && (
				<div
					css={{
						position: "absolute",
						left: "50%",
						top: "50%",
					}}>
					<Loader size="small" />
				</div>
			)}
			<div
				css={{
					marginBottom: 20,
					display: "flex",
					justifyContent: "flex-end",
					alignItems: "center",
				}}>
				<div css={{ marginRight: 5, color: isEditError ? "red" : "#6c6f76" }}>
					{isSaved
						? "All changes saved"
						: isEditError
						? "An error occurred. Please try again"
						: ""}
				</div>
				{saving ? (
					<Icon size="large" loading name="spinner" />
				) : (
					<Icon
						css={{ cursor: isSaved ? "initial" : "pointer" }}
						size="large"
						name="save"
						onClick={onEditNote}
						disabled={isSaved}
					/>
				)}
			</div>
			<textarea
				value={textInState}
				onChange={(e) => setTextInState(e.target.value)}
				placeholder="Add your notes here..."
				css={{
					width: defaultNoteWidth,
					height: defaultNoteHeight,
					resize: "none",
					outline: "none",
					lineHeight: 1.5,
					padding: 20,
					position: "relative",
					border: "1px solid #E8E8E8",
					fontSize: "1em",
					borderBottomRightRadius: "60px 5px",
					display: "inline-block",
					background: "#ffff88" /* Old browsers */,
					background:
						"-moz-linear-gradient(-45deg, #ffff88 81%, #ffff88 82%, #ffff88 82%, #ffffc6 100%)" /* FF3.6+ */,
					background:
						"-webkit-gradient(linear, left top, right bottom, color-stop(81%,#ffff88), color-stop(82%,#ffff88), color-stop(82%,#ffff88), color-stop(100%,#ffffc6))" /* Chrome,Safari4+ */,
					background:
						"-webkit-linear-gradient(-45deg, #ffff88 81%,#ffff88 82%,#ffff88 82%,#ffffc6 100%)" /* Chrome10+,Safari5.1+ */,
					background:
						"-o-linear-gradient(-45deg, #ffff88 81%,#ffff88 82%,#ffff88 82%,#ffffc6 100%)" /* Opera 11.10+ */,
					background:
						"-ms-linear-gradient(-45deg, #ffff88 81%,#ffff88 82%,#ffff88 82%,#ffffc6 100%)" /* IE10+ */,
					background:
						"linear-gradient(135deg, #ffff88 81%,#ffff88 82%,#ffff88 82%,#ffffc6 100%)" /* W3C */,
					filter:
						"progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffff88', endColorstr='#ffffc6',GradientType=1 )",
				}}
			/>
		</div>
	);
};

export default Note;
