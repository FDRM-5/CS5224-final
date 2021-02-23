import { CKEditor } from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";

const Editor = () => {
	return (
		<div>
			<CKEditor
				editor={InlineEditor}
				data="<p>Hello from CKEditor 5!</p>"
				config={
					{
						// toolbar: [
						// 	"heading",
						// 	"|",
						// 	"bold",
						// 	"italic",
						// 	"link",
						// 	"bulletedList",
						// 	"numberedList",
						// 	"blockQuote",
						// ],
						// heading: {
						// 	options: [
						// 		{
						// 			model: "paragraph",
						// 			title: "Paragraph",
						// 			class: "ck-heading_paragraph",
						// 		},
						// 		{
						// 			model: "heading1",
						// 			view: "h1",
						// 			title: "Heading 1",
						// 			class: "ck-heading_heading1",
						// 		},
						// 		{
						// 			model: "heading2",
						// 			view: "h2",
						// 			title: "Heading 2",
						// 			class: "ck-heading_heading2",
						// 		},
						// 	],
						// },
					}
				}
				onChange={(event, editor) => {
					setText(editor.getData());
					console.log("onChange", editor.getData());
				}}
				onBlur={(event, editor) => {
					// console.log("Blur.", editor);
				}}
				onFocus={(event, editor) => {
					// console.log("Focus.", editor);
				}}
			/>
		</div>
	);
};

export default Editor;
