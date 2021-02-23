import { useState, useCallback } from "react";
import { withRouter } from "react-router-dom";

import { Menu, Icon } from "semantic-ui-react";

const pages = [
	{ name: "home", path: "/", label: "Home" },
	{ name: "sticky note", path: "/notes", label: "Doodle" },
	{ name: "book", path: "/study", label: "Notebook", disabled: true },
];

const Navigate = ({ history, location }) => {
	const [dim, setDim] = useState(true);

	const goToPage = useCallback((path) => history.push(path), [history]);

	return (
		<div
			css={{
				opacity: dim ? 0.4 : 1,
				position: "absolute",
				top: 0,
				right: 0,
				padding: 20,
				transition: "opacity 0.2s ease-in-out",
				zIndex: 3,
			}}
			onMouseEnter={() => setDim(false)}
			onMouseLeave={() => setDim(true)}>
			<Menu compact vertical icon="labeled" size="tiny">
				{pages.map((page) => (
					<Menu.Item
						key={page.label}
						name={page.name}
						active={location.pathname === page.path}
						disabled={!!page.disabled}
						onClick={() => goToPage(page.path)}>
						<Icon name={page.name} />
						{page.label}
					</Menu.Item>
				))}
			</Menu>
		</div>
	);
};

export default withRouter(Navigate);
