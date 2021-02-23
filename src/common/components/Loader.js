import { keyframes } from "@emotion/core";

const Loader = ({ size, text }) => {
	const multiplier =
		size === "large"
			? 1
			: size === "medium"
			? 0.7
			: size === "small"
			? 0.5
			: 0.3;
	const circleStyle = {
		width: multiplier * 20,
		height: multiplier * 20,
		position: "absolute",
		borderRadius: "50%",
		backgroundColor: "#6c6f76",
		left: "15%",
		transformOrigin: `${multiplier * 50}%`,
		animation: `${keyframes`
			0% {
				top: ${multiplier * 60}px;
				height: ${multiplier * 5}px;
				border-radius: ${multiplier * 50}px ${multiplier * 50}px ${multiplier * 25}px ${
			multiplier * 25
		}px;
				transform: scaleX(1.7);
			}
			40% {
				height: ${multiplier * 20}px;
				border-radius: 50%;
				transform: scaleX(1);
			}
			100% {
				top: 0%;
			}
			`} 0.5s alternate infinite ease`,
		"&:nth-of-type(2)": {
			left: "45%",
			animationDelay: "0.2s",
		},
		"&:nth-of-type(3)": {
			left: "auto",
			right: "15%",
			animationDelay: "0.3s",
		},
	};
	const shadowStyle = {
		width: multiplier * 20,
		height: multiplier * 4,
		borderRadius: "50%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		position: "absolute",
		top: multiplier * 62,
		transformOrigin: `${multiplier * 50}%`,
		zIndex: -1,
		left: "15%",
		filter: "blur(1px)",
		animation: `${keyframes`
			0% {
				transform: scaleX(1.5);
			}
			40% {
				transform: scaleX(1);
				opacity: 0.7;
			}
			100% {
				transform: scaleX(0.2);
				opacity: 0.4;
			}
			`} 0.5s alternate infinite ease`,
		"&:nth-of-type(4)": {
			left: "45%",
			animationDelay: "0.2s",
		},
		"&:nth-of-type(5)": {
			left: "auto",
			right: "15%",
			animationDelay: "0.3s",
		},
	};
	const wrapperStyle = {
		width: multiplier * 200,
		height: multiplier * 60,
		position: "absolute",
		left: "50%",
		top: "50%",
		transform: "translate(-50%, -50%)",
		zIndex: 4,
	};
	const textStyle = {
		position: "absolute",
		top: multiplier * 75,
		fontFamily: "Lato",
		fontSize: multiplier * 20,
		letterSpacing: multiplier * 12,
		color: "#6c6f76",
		left: "15%",
	};

	return (
		<div css={wrapperStyle}>
			<div css={circleStyle} />
			<div css={circleStyle} />
			<div css={circleStyle} />
			<div css={shadowStyle} />
			<div css={shadowStyle} />
			<div css={shadowStyle} />
			{text && <span css={textStyle}>{text}</span>}
		</div>
	);
};

export default Loader;
