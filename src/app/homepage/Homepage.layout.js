import { Image } from "semantic-ui-react";

const HomepageLayout = () => (
	<div
		css={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			marginTop: 70,
		}}>
		<div css={{ fontSize: 72, lineHeight: 1 }}>Hi, I'm Gaurav.</div>
		<div css={{ marginTop: 50 }}>
			<Image
				src="https://gs-general.s3-ap-southeast-1.amazonaws.com/store/GS-self.png"
				size="huge"
			/>
		</div>
		{/* <div css={{ fontSize: 24, marginTop: 30 }}>And this is my online crib.</div> */}
	</div>
);

export default HomepageLayout;
